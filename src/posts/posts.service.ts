import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadService } from 'src/upload/upload.service';
import {
  Subscribes,
  SubscribeRequestState,
  BlockState,
} from 'src/subscribes/entities/subscribes.entity';
import { UserProfile, UUID } from 'src/users/entities/users-profile.entity';
import { Repository } from 'typeorm';
import {
  CreatePostOutputDto,
  CreatePostInputDto,
} from './dtos/create-post-dto';
import {
  DeletePostInputDto,
  DeletePostOutputDto,
} from './dtos/delete-post.dto';
import { EditPostInputDto, EditPostOutputDto } from './dtos/edit-post-dto';
import { GetMyPostsOutputDto } from './dtos/get-my-posts.dto';
import { GetSubscribingPostsOutputDto } from './dtos/get-subscribing-posts.dto';
import { Posts } from './entities/posts.entity';
import {
  GetUserPostsInputDto,
  GetUserPostsOutputDto,
} from './dtos/get-user-posts.dto';
import { Likes } from 'src/likes/entities/likes.entity';
import {
  GetPostsByAddressInputDto,
  getPostsByAddressOutputDto,
} from './dtos/get-posts-by-address.dto';
import { GetMyLikedPostsOutputDto } from './dtos/get-my-liked-posts.dto';
import { CursorPaginationArgs } from 'src/common/dtos/cursor-pagination';
import { SubscribesUtil } from 'src/subscribes/subscribes.util';
import {
  GetPostDetailInputDto,
  GetPostDetailOutputDto,
} from './dtos/get-post-detail.dto';
import { Comments } from 'src/comments/entities/comments.entity';
import { ReportPosts } from 'src/reports/entities/report-posts.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private postsRepository: Repository<Posts>,
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
    @InjectRepository(Subscribes)
    private subscribesRepository: Repository<Subscribes>,
    @InjectRepository(Likes)
    private likesRepository: Repository<Likes>,
    @InjectRepository(Comments)
    private commentsRepository: Repository<Comments>,
    @InjectRepository(ReportPosts)
    private reportPostsRepository: Repository<ReportPosts>,
    private subscribesUtil: SubscribesUtil,
    private uploadService: UploadService,
  ) {}

  async createPost(
    { userId }: UUID,
    args: CreatePostInputDto,
  ): Promise<CreatePostOutputDto> {
    console.log(userId);
    try {
      const user = await this.userProfileRepository.findOne({ id: userId });
      if (!user) {
        return {
          ok: false,
          error: '사용자정보를 찾을 수 없습니다.',
        };
      }
      await this.postsRepository.save(
        await this.postsRepository.create({
          ...args,
          photos: JSON.stringify(args.photoUrls),
          user,
          userId,
        }),
      );
      return {
        ok: true,
      };
    } catch (e) {
      // console.log(e);
      return {
        ok: false,
        error: '게시물 생성에 실패하였습니다.',
      };
    }
  }

  async editPost(
    { userId }: UUID,
    { postId, photoUrls, ...rest }: EditPostInputDto,
  ): Promise<EditPostOutputDto> {
    try {
      const post = await this.postsRepository.findOne({ id: postId });
      if (!post) {
        return {
          ok: false,
          error: '게시글이 존재하지 않습니다.',
        };
      }
      if (post.userId !== userId) {
        return {
          ok: false,
          error: '다른사람의 게시글은 수정할 수 없습니다.',
        };
      }
      await this.postsRepository.update(
        { id: postId },
        {
          ...rest,
          photos: JSON.stringify(photoUrls),
        },
      );
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '게시글 수정에 실패하였습니다.',
      };
    }
  }

  async deletePost(
    { userId }: UUID,
    { id }: DeletePostInputDto,
  ): Promise<DeletePostOutputDto> {
    try {
      const post = await this.postsRepository.findOne({ id });
      if (!post) {
        return {
          ok: false,
          error: '게시글이 존재하지 않습니다.',
        };
      }
      if (post.userId !== userId) {
        return {
          ok: false,
          error: '다른 사람의 게시글은 삭제할수 없습니다.',
        };
      }
      const photos = JSON.parse(post.photos);
      const deletePromises = photos.map((photo) =>
        this.uploadService.deleteFileAtS3(photo),
      );
      await Promise.all(deletePromises).catch(() => {
        throw new Error('s3파일 삭제 실패');
      });

      await this.postsRepository.delete(post);
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '게시물 삭제에 실패했습니다.',
      };
    }
  }

  async getMyPosts(
    { userId }: UUID,
    { take, cursor }: CursorPaginationArgs,
  ): Promise<GetMyPostsOutputDto> {
    try {
      // console.log('limit : ', limit, 'offset : ', offset);
      const posts = await this.postsRepository
        .createQueryBuilder('posts')
        .where(
          '(posts.createdAt < :createdAt OR (posts.createdAt = :createdAt AND posts.id < :postId))',
          {
            createdAt: cursor.createdAt,
            postId: cursor.id,
          },
        )
        .andWhere('posts.userId = :userId', { userId })
        .loadRelationCountAndMap('posts.likes', 'posts.likedUsers')
        .orderBy('posts.createdAt', 'DESC')
        .addOrderBy('posts.id', 'DESC')
        .take(take)
        .getMany();

      // console.log(posts);
      return {
        ok: true,
        data: posts,
        length: posts.length,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '게시물 조회에 실패했습니다.',
      };
    }
  }

  async getUserPosts(
    { userId: authUserId }: UUID,
    { username }: GetUserPostsInputDto,
    { take, cursor }: CursorPaginationArgs,
  ): Promise<GetUserPostsOutputDto> {
    try {
      const { id: userId, profileOpen } =
        await this.userProfileRepository.findOne({
          where: { username },
        });

      if (!userId) {
        return {
          ok: false,
          error: '사용자를 찾을 수 없습니다.',
        };
      }

      if (authUserId === userId) {
        return this.getMyPosts({ userId }, { take, cursor });
      }

      const isSubscribing = await this.subscribesRepository.findOne({
        from: authUserId,
        to: userId,
        subscribeRequest: SubscribeRequestState.CONFIRMED,
      });
      // console.log(profileOpen, isSubscribing);
      if (!profileOpen && !isSubscribing) {
        return {
          ok: true,
          data: [],
          length: 0,
        };
      }

      const { blocking } =
        await this.subscribesUtil.checkBlockingAndRequestState({
          requestUser: authUserId,
          targetUser: userId,
        });
      if (blocking !== BlockState.NONE) {
        return {
          ok: true,
          data: [],
          length: 0,
        };
      }
      const posts = await this.postsRepository
        .createQueryBuilder('posts')
        .where(
          '(posts.createdAt < :createdAt OR (posts.createdAt = :createdAt AND posts.id < :postId))',
          {
            createdAt: cursor.createdAt,
            postId: cursor.id,
          },
        )
        .andWhere('posts.userId = :userId', { userId })
        .orderBy('posts.createdAt', 'DESC')
        .addOrderBy('posts.id', 'DESC')
        .take(take)
        .getMany();

      return {
        ok: true,
        data: posts,
        length: posts.length,
      };
    } catch (e) {
      return {
        ok: false,
        error: '게시물 조회에 실패했습니다.',
      };
    }
  }

  async getSubscribingPosts(
    { userId }: UUID,
    { take, cursor }: CursorPaginationArgs,
  ): Promise<GetSubscribingPostsOutputDto> {
    try {
      // console.log(take, cursor);
      const mySubscribes = await this.subscribesRepository
        .createQueryBuilder('subs')
        .where('subs.to = :userId AND subs.from = :userId', { userId })
        .where('subs.to = :userId AND block = :blockstate', {
          userId,
          blockstate: false,
        })
        .where(
          'subs.from = :userId AND block = :blockstate AND subs.subscribeRequest = :requestState',
          {
            userId,
            blockstate: false,
            requestState: SubscribeRequestState.CONFIRMED,
          },
        )
        .innerJoin('subs.to', 'user')
        .select(['subs.id', 'user.id'])
        .getMany();

      // console.log(mySubscibes);
      const subscribeIds = [
        ...mySubscribes.map((subscribe) => subscribe.to?.['id']),
        userId,
      ];

      // 신고한 게시물은 보이지 않게 함.
      const reportedPost = await this.reportPostsRepository.find({
        select: ['reportedPostId'],
        where: {
          reportUserId: userId,
        },
      });
      const reportedPostId = reportedPost.length
        ? reportedPost.map((val) => val.reportedPostId)
        : ['00000000-0000-0000-0000-000000000000'];
      // console.log(reportedPostId);

      const subscribingPosts = await this.postsRepository
        .createQueryBuilder('posts')
        .select(['posts', 'user.photo', 'user.id', 'user.username'])
        .loadRelationCountAndMap(
          'posts.commentCounts',
          'posts.comments',
          'commentCounts',
        )
        .loadRelationCountAndMap(
          'posts.liked',
          'posts.likedUsers',
          'like',
          (qb) => qb.where('like.userId = :id', { id: userId }),
        )
        .loadRelationCountAndMap('posts.likes', 'posts.likedUsers')
        .where(
          `(posts.createdAt < :createdAt OR (posts.createdAt = :createdAt AND posts.id < :postId))
          AND (posts.id NOT IN(:...reportedPostId))
          AND (posts.userId IN (:...userIds))
          `,
          {
            reportedPostId,
            createdAt: cursor.createdAt,
            postId: cursor.id,
            userIds: subscribeIds,
          },
        )
        .innerJoin('posts.user', 'user')
        .orderBy('posts.createdAt', 'DESC')
        .addOrderBy('posts.id', 'DESC')
        .take(take)
        .getMany();

      return {
        ok: true,
        data: subscribingPosts,
        length: subscribingPosts.length,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '게시물 조회에 실패했습니다.',
      };
    }
  }
  async getPostsByAddress(
    { userId }: UUID,
    { address }: GetPostsByAddressInputDto,
    { take, cursor }: CursorPaginationArgs,
  ): Promise<getPostsByAddressOutputDto> {
    try {
      // console.log(execptUserIds);

      // 구독중인 유저 및 차단한 유저 목록 전부를 가져옴
      const relatedUsers = await this.subscribesRepository
        .createQueryBuilder('subs')
        .loadAllRelationIds({ relations: ['to', 'from'] })
        .where('subs.from = :userId AND subs.subscribeRequest = :request', {
          userId,
          request: SubscribeRequestState.CONFIRMED,
        })
        .orWhere('subs.block = true')
        .getMany();

      // console.log(relatedUsers);

      //차단한 유저는 제외.
      let subscribingUsers = relatedUsers
        .map((relatedUser) => {
          if (relatedUser.block) {
            return null;
          }
          return relatedUser.to;
        })
        .filter((data) => data);

      subscribingUsers = [...subscribingUsers, userId];

      // console.log('subscribingUsers', subscribingUsers);

      let execptUserIds = relatedUsers
        .map((relatedUser) => {
          if (relatedUser.block) {
            if (relatedUser.to !== userId) {
              return relatedUser.to;
            }
            return relatedUser.from;
          }
          return null;
        })
        .filter((data) => data);
      //빈 array를 집어넣으면 에러가 나므로, 0000인 UUID를 기본값으로 넣어줌
      execptUserIds = execptUserIds.length
        ? execptUserIds
        : ['00000000-0000-0000-0000-000000000000'];
      // console.log('execptUserIds', execptUserIds);

      // 신고한 게시물은 보이지 않게 함.
      const reportedPost = await this.reportPostsRepository.find({
        select: ['reportedPostId'],
        where: {
          reportUserId: userId,
        },
      });
      const reportedPostId = reportedPost.length
        ? reportedPost.map((val) => val.reportedPostId)
        : ['00000000-0000-0000-0000-000000000000'];
      // console.log(reportedPostId);

      const posts = await this.postsRepository
        .createQueryBuilder('posts')
        .innerJoinAndSelect('posts.user', 'user')
        .loadRelationCountAndMap(
          'posts.commentCounts',
          'posts.comments',
          'commentCounts',
        )
        .loadRelationCountAndMap(
          'posts.liked',
          'posts.likedUsers',
          'like',
          (qb) => qb.where('like.userId = :id', { id: userId }),
        )
        .loadRelationCountAndMap('posts.likes', 'posts.likedUsers')
        .where(
          `
          (user.id NOT IN (:...execptUserIds))
          AND (posts.id NOT IN(:...reportedPostId))
          AND (user.profileOpen = :open OR user.id In (:...subscribingUsers))
          AND (posts.createdAt < :createdAt OR (posts.createdAt = :createdAt AND posts.id < :postId))
          AND (posts.address LIKE :q)
          `,
          {
            execptUserIds,
            reportedPostId,
            open: true,
            subscribingUsers,
            createdAt: cursor.createdAt,
            postId: cursor.id,
            q: `%${address}%`,
          },
        )

        .orderBy('posts.createdAt', 'DESC')
        .addOrderBy('posts.id', 'DESC')
        .take(take)
        .getMany();
      // console.log(posts);

      return {
        ok: true,
        data: posts,
        length: posts.length,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '게시물 주소검색에 실패했습니다.',
      };
    }
  }
  async getMyLikedPosts(
    { userId }: UUID,
    { take, cursor }: CursorPaginationArgs,
  ): Promise<GetMyLikedPostsOutputDto> {
    try {
      const likedPosts = await this.likesRepository
        .createQueryBuilder('like')
        .where(
          '(like.createdAt < :createdAt OR (like.createdAt = :createdAt AND like.id < :postId))',
          {
            createdAt: cursor.createdAt,
            postId: cursor.id,
          },
        )
        .andWhere('like.userId = :userId', { userId })
        .leftJoinAndSelect('like.post', 'post')
        .leftJoinAndSelect('post.user', 'user')
        .orderBy('like.updatedAt', 'DESC')
        .addOrderBy('like.id', 'DESC')
        .take(take)
        .getMany();

      // console.log(likedPosts);

      const posts = likedPosts.map((like) => ({
        ...like.post,
        liked: like.like,
      }));

      return {
        ok: true,
        data: posts,
        length: posts.length,
      };
    } catch (e) {
      return {
        ok: false,
        error: '좋아요 누른 게시물 조회에 실패했습니다.',
      };
    }
  }

  async getPostDetail(
    { userId }: UUID,
    { id }: GetPostDetailInputDto,
  ): Promise<GetPostDetailOutputDto> {
    try {
      const post = await this.postsRepository
        .createQueryBuilder('posts')
        .where('posts.id = :id', { id })
        .loadRelationCountAndMap(
          'posts.commentCounts',
          'posts.comments',
          'commentCounts',
        )
        .loadRelationCountAndMap(
          'posts.liked',
          'posts.likedUsers',
          'like',
          (qb) => qb.where('like.userId = :id', { id: userId }),
        )
        .loadRelationCountAndMap('posts.likes', 'posts.likedUsers')
        .leftJoinAndSelect('posts.user', 'user')
        .getOne();

      // console.log(post);
      const postAuthor = post.user;

      // 내 게시글은 바로 보여줌
      if (userId === postAuthor.id) {
        return {
          ok: true,
          data: {
            ...post,
          },
        };
      }

      //차단 여부, 구독여부 확인해서 클라이언트로 전송
      const { blocking, subscribeRequest } =
        await this.subscribesUtil.checkBlockingAndRequestState({
          requestUser: userId,
          targetUser: postAuthor.id,
        });

      const rejectedMessage =
        this.subscribesUtil.returnBlockAndSubscribeMessage(
          blocking,
          subscribeRequest,
          postAuthor.profileOpen,
        );
      if (rejectedMessage) {
        return rejectedMessage;
      }

      return {
        ok: true,
        data: {
          ...post,
        },
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '게시물 정보 조회에 실패했습니다.',
      };
    }
  }
}
