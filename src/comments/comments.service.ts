import { InjectRepository } from '@nestjs/typeorm';
import { CursorPaginationArgs } from 'src/common/dtos/cursor-pagination';
import { Posts } from 'src/posts/entities/posts.entity';
import { Subscribes } from 'src/subscribes/entities/subscribes.entity';
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
  DeleteReCommentInputDto,
  DeleteReCommentOutputDto,
} from './dtos/delete-recomment.dto';

import {
  GetCommentDetailInputDto,
  GetCommentDetailOutputDto,
} from './dtos/get-comment-detail.dto';
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

      const isBlockRelation = await this.subscribesRepository.findOne({
        where: [
          { from: userId, to: post.userId, block: true },
          { to: userId, from: post.userId, block: true },
        ],
      });
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
    { content, parentCommentId }: CreateReCommentInputDto,
  ): Promise<CreateReCommentOutputDto> {
    return { ok: true };
  }

  async getCommentDetail(
    { userId }: UUID,
    { id }: GetCommentDetailInputDto,
    { take, cursor }: CursorPaginationArgs,
  ): Promise<GetCommentDetailOutputDto> {
    return { ok: true };
  }

  async deleteComment(
    { userId }: UUID,
    { id }: DeleteCommentInputDto,
  ): Promise<DeleteCommentOutputDto> {
    return { ok: true };
  }

  async deleteReComment(
    { userId }: UUID,
    { id }: DeleteReCommentInputDto,
  ): Promise<DeleteReCommentOutputDto> {
    return { ok: true };
  }
}
