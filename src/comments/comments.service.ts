import { CursorPaginationArgs } from 'src/common/dtos/cursor-pagination';
import { UUID } from 'src/users/entities/users-profile.entity';
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

export class CommentsService {
  async createComment(
    { userId }: UUID,
    { content }: CreateCommentInputDto,
  ): Promise<CreateCommentOutputDto> {
    return { ok: true };
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
