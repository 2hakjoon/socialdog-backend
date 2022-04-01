import { InjectRepository } from '@nestjs/typeorm';
import { CursorPaginationArgs } from 'src/common/dtos/cursor-pagination';
import { Posts } from 'src/posts/entities/posts.entity';
import { Subscribes } from 'src/subscribes/entities/subscribes.entity';
import { SubscribesUtil } from 'src/subscribes/subscribes.util';
import { UserProfile, UUID } from 'src/users/entities/users-profile.entity';
import { Repository } from 'typeorm';
import {
  CreateCommentInputDto,
  CreateCommentOutputDto,
} from './dtos/create-comment.dto';
import {
  CreateReCommentInputDto,
  CreateReCommentOutputDto,
} from './dtos/create-recomment.dto';
import {
  DeleteCommentInputDto,
  DeleteCommentOutputDto,
} from './dtos/delete-comment.dto';
import {
  EditCommentInputDto,
  EditCommentOutputDto,
} from './dtos/edit-comment-dto';
import {
  GetCommentInputDto,
  GetCommentOutputDto,
} from './dtos/get-comment.dto';
import {
  GetCommentsInputDto,
  GetCommentsOutputDto,
} from './dtos/get-comments.dto';

import {
  GetReCommentsInputDto,
  GetReCommentsOutputDto,
} from './dtos/get-recomments.dto';
import { Comments } from './entities/comments.entity';

export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private commentsRepository: Repository<Comments>,
    @InjectRepository(Posts)
    private postsRepository: Repository<Posts>,
    @InjectRepository(Subscribes)
    private subscribesRepository: Repository<Subscribes>,
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
    private subscribeUtil: SubscribesUtil,
  ) {}

  async createComment(
    { userId }: UUID,
    { content, postId }: CreateCommentInputDto,
  ): Promise<CreateCommentOutputDto> {
    try {
      const user = await this.userProfileRepository.findOne({ id: userId });
      if (!user) {
        return {
          ok: false,
          error: '사용자를 찾을 수 없습니다.',
        };
      }

      const post = await this.postsRepository.findOne({ id: postId });
      if (!post) {
        return {
          ok: false,
          error: '게시물이 존재하지 않습니다.',
        };
      }

      const isBlockRelation = await this.subscribeUtil.checkIsBlockRelation(
        userId,
        post.userId,
      );

      if (isBlockRelation) {
        return {
          ok: false,
          error: '댓글을 작성할 수 없습니다.',
        };
      }

      await this.commentsRepository.save(
        await this.commentsRepository.create({
          user,
          post,
          postId,
          content,
          depth: 0,
        }),
      );

      return { ok: true };
    } catch (e) {
      console.log(e);
      return { ok: false, error: '댓글 작성에 실패했습니다.' };
    }
  }
  async createReComment(
    { userId }: UUID,
    { content, parentCommentId, postId }: CreateReCommentInputDto,
  ): Promise<CreateReCommentOutputDto> {
    try {
      const user = await this.userProfileRepository.findOne({ id: userId });
      if (!user) {
        return {
          ok: false,
          error: '사용자를 찾을 수 없습니다.',
        };
      }
      const parentComment = await this.commentsRepository.findOne(
        {
          id: parentCommentId,
        },
        { relations: ['post'] },
      );
      // console.log(parentComment);
      if (!parentComment) {
        return {
          ok: false,
          error: '댓글이 존재하지 않습니다.',
        };
      }

      const post = parentComment.post;

      if (parentComment.post.id !== postId) {
        return {
          ok: false,
          error: '해당 게시글에 달린 댓글이 아닙니다.',
        };
      }

      const isBlockRelation = await this.subscribeUtil.checkIsBlockRelation(
        userId,
        post.userId,
      );

      if (isBlockRelation) {
        return {
          ok: false,
          error: '대댓글을 작성할 수 없습니다.',
        };
      }
      await this.commentsRepository.save(
        await this.commentsRepository.create({
          user,
          parentComment,
          parentCommentId: parentCommentId,
          postId,
          post,
          content,
          depth: 1,
        }),
      );
      return { ok: true };
    } catch (e) {
      console.log(e);
      return { ok: false, error: '대댓글 작성에 실패했습니다.' };
    }
  }

  async editComment(
    { userId }: UUID,
    { content, id }: EditCommentInputDto,
  ): Promise<EditCommentOutputDto> {
    try {
      const comment = await this.commentsRepository.findOne(
        { id },
        { relations: ['user'] },
      );
      if (!comment) {
        return {
          ok: false,
          error: '댓글이 존재하지 않습니다.',
        };
      }
      if (comment.user.id !== userId) {
        return {
          ok: false,
          error: '다른사람의 댓글은 수정할 수 없습니다.',
        };
      }
      await this.commentsRepository.update(
        { id },
        {
          ...comment,
          content,
        },
      );
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '댓글 수정에 실패했습니다.',
      };
    }
  }

  async getComment(
    { userId }: UUID,
    { id }: GetCommentInputDto,
  ): Promise<GetCommentOutputDto> {
    try {
      const comment = await this.commentsRepository.findOne(
        { id },
        { relations: ['user', 'post'] },
      );
      if (!comment) {
        return {
          ok: true,
          error: '댓글이 존재하지 않습니다.',
        };
      }

      //차단 여부, 구독여부 확인해서 클라이언트로 전송
      const { blocking, subscribeRequest } =
        await this.subscribeUtil.checkBlockingAndRequestState({
          requestUser: userId,
          targetUser: comment.post.id,
        });

      const rejectedMessage = this.subscribeUtil.returnBlockAndSubscribeMessage(
        blocking,
        subscribeRequest,
        comment.user.profileOpen,
      );
      if (rejectedMessage) {
        return rejectedMessage;
      }

      return { ok: true, data: comment };
    } catch (e) {
      return { ok: false, error: '댓글 조회에 실패했습니다.' };
    }
  }

  async getReComments(
    { userId }: UUID,
    { parentCommentId }: GetReCommentsInputDto,
    { take, cursor }: CursorPaginationArgs,
  ): Promise<GetReCommentsOutputDto> {
    try {
      const reComments = await this.commentsRepository
        .createQueryBuilder('comments')
        .where('comments.parentCommentId = :commentId', {
          commentId: parentCommentId,
        })
        .andWhere(
          '((comments.createdAt > :createdAt) OR (comments.createdAt = :createdAt AND comments.id < :id))',
          {
            createdAt: cursor.createdAt,
            id: cursor.id,
          },
        )
        .leftJoinAndSelect('comments.user', 'users')
        .leftJoinAndSelect('comments.post', 'posts')
        .orderBy('comments.createdAt', 'ASC')
        .addOrderBy('comments.id', 'DESC')
        .limit(take)
        .getMany();
      // console.log(reComments);

      //차단 여부, 구독여부 확인해서 클라이언트로 전송
      if (reComments.length && userId !== reComments[0].post.userId) {
        const { blocking, subscribeRequest } =
          await this.subscribeUtil.checkBlockingAndRequestState({
            requestUser: userId,
            targetUser: reComments[0].post.userId,
          });

        const rejectedMessage =
          this.subscribeUtil.returnBlockAndSubscribeMessage(
            blocking,
            subscribeRequest,
            reComments[0].user.profileOpen,
          );
        if (rejectedMessage) {
          return rejectedMessage;
        }
      }

      return { ok: true, data: reComments };
    } catch (e) {
      console.log(e);
      return { ok: false, error: '댓글 조회에 실패했습니다.' };
    }
  }

  async deleteComment(
    { userId }: UUID,
    { id }: DeleteCommentInputDto,
  ): Promise<DeleteCommentOutputDto> {
    try {
      const comment = await this.commentsRepository.findOne(
        { id },
        { relations: ['post', 'user'] },
      );
      if (!comment) {
        return {
          ok: false,
          error: '댓글이 존재하지 않습니다.',
        };
      }
      if (comment.post.userId !== userId && comment.user.id !== userId) {
        return {
          ok: false,
          error: '댓글을 삭제할 권한이 없습니다.',
        };
      }

      await this.commentsRepository.delete({ id });

      return { ok: true };
    } catch (e) {
      console.log(e);
      return { ok: true, error: '댓글 삭제를 실패했습니다.' };
    }
  }

  async getComments(
    { userId }: UUID,
    { postId }: GetCommentsInputDto,
    { take, cursor }: CursorPaginationArgs,
  ): Promise<GetCommentsOutputDto> {
    try {
      const comments = await this.commentsRepository
        .createQueryBuilder('comments')
        .leftJoinAndSelect('comments.post', 'post')
        .leftJoinAndSelect('comments.user', 'user')
        .loadRelationCountAndMap(
          'comments.reCommentCounts',
          'comments.childComment',
          'reCommentCounts',
        )
        .where('comments.postId = :postId', { postId })
        .andWhere('comments.depth = 0')
        .andWhere(
          '((comments.createdAt > :createdAt) OR (comments.createdAt = :createdAt AND comments.id < :id))',
          {
            createdAt: cursor.createdAt,
            id: cursor.id,
          },
        )
        .take(take)
        .orderBy('comments.createdAt', 'ASC')
        .addOrderBy('comments.id', 'DESC')
        .getMany();

      // console.log(comments);

      //차단 여부, 구독여부 확인해서 클라이언트로 전송
      if (comments.length && userId !== comments[0].post.userId) {
        const { blocking, subscribeRequest } =
          await this.subscribeUtil.checkBlockingAndRequestState({
            requestUser: userId,
            targetUser: comments[0].post.userId,
          });

        const rejectedMessage =
          this.subscribeUtil.returnBlockAndSubscribeMessage(
            blocking,
            subscribeRequest,
            comments[0].user.profileOpen,
          );
        if (rejectedMessage) {
          console.log(rejectedMessage);
          return rejectedMessage;
        }
      }

      return {
        ok: true,
        data: comments,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '댓글목록을 불러오는데 실패했습니다.',
      };
    }
  }
}
