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
import {
  GetMyPostsInputDto,
  GetMyPostsOutputDto,
} from './dtos/get-my-posts.dto';
import { GetSubscribingPostsOutputDto } from './dtos/get-subscribing-posts.dto';
import { Posts } from './entities/posts.entity';
import {
  GetUserPostsInputDto,
  GetUserPostsOutputDto,
} from './dtos/get-user-posts.dto';
import { SubscribesService } from 'src/subscribes/subscribes.service';
import { CorePagination } from '../common/dtos/core-pagination.dto';
import { Likes } from 'src/likes/entities/likes.entity';

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
    private subscribesService: SubscribesService,
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
          photos: JSON.stringify(args.photos),
          user,
          userId,
        }),
      );
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '게시물 생성에 실패하였습니다.',
      };
    }
  }

  async editPost(
    { userId }: UUID,
    { postId, ...rest }: EditPostInputDto,
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
          ...post,
          ...rest,
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

      await this.postsRepository.remove(post);
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
    { limit, offset }: GetMyPostsInputDto,
  ): Promise<GetMyPostsOutputDto> {
    try {
      console.log('limit : ', limit, 'offset : ', offset);
      const posts = await this.postsRepository
        .createQueryBuilder('posts')
        .where('posts.userId = :userId', { userId })
        .loadRelationCountAndMap('posts.likes', 'posts.likedUsers')
        .orderBy('posts.createdAt', 'DESC')
        .skip(offset)
        .take(limit)
        .getMany();

      // console.log(posts);
      return {
        ok: true,
        data: posts,
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
    { limit, offset }: CorePagination,
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
        return this.getMyPosts({ userId }, { limit, offset });
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
        };
      }

      const { blocking } =
        await this.subscribesService.checkBlockingAndRequestState({
          requestUser: authUserId,
          targetUser: userId,
        });
      if (blocking !== BlockState.NONE) {
        return {
          ok: true,
          data: [],
        };
      }
      const posts = await this.postsRepository
        .createQueryBuilder('posts')
        .where('posts.userId = :userId', { userId })
        .orderBy('posts.createdAt', 'DESC')
        .skip(offset)
        .take(limit)
        .getMany();

      return {
        ok: true,
        data: posts,
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
    { limit, offset }: CorePagination,
  ): Promise<GetSubscribingPostsOutputDto> {
    try {
      const mySubscibes = await this.subscribesRepository
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
        ...mySubscibes.map((subscribe) => subscribe.to?.['id']),
        userId,
      ];

      const subscribingPosts = await this.postsRepository
        .createQueryBuilder('posts')
        .select(['posts', 'user.photo', 'user.id', 'user.username'])
        .where('posts.userId IN (:...userIds)', {
          userIds: subscribeIds,
        })
        .innerJoin('posts.user', 'user')
        .orderBy('posts.createdAt', 'DESC')
        .skip(offset)
        .take(limit)
        .getMany();
      // console.log(subscribingPosts);

      const postIds = subscribingPosts.map((post) => post.id);
      const myLikes = await this.likesRepository
        .createQueryBuilder('like')
        .select(['like.like', 'like.userId', 'like.postId'])
        .where('like.postId IN (:...postIds)', { postIds })
        .getMany();

      // console.log(myLikes);
      const subscribingPostsWithLike = subscribingPosts.map((post) => {
        if (
          myLikes.filter((like) => {
            return like.postId === post.id && like.userId === userId;
          }).length
        ) {
          return { ...post, liked: true };
        }
        return { ...post, liked: false };
      });

      // console.log(postsWithLike);

      return {
        ok: true,
        data: subscribingPostsWithLike,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '게시물 조회에 실패했습니다.',
      };
    }
  }
}
