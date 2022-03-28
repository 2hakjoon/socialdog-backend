import { UUID } from 'src/users/entities/users-profile.entity';
import {
  CreateCommentInputDto,
  CreateCommentOutputDto,
} from './dtos/create-comment.dto';
import {
  CreateReCommentInputDto,
  CreateReCommentOutputDto,
} from './dtos/create-recomment.dto';

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
}
