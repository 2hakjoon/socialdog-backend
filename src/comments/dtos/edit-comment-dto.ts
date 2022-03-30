import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { Comments } from '../entities/comments.entity';

@InputType()
export class EditCommentInputDto extends PickType(Comments, [
  'content',
  'id',
]) {}

@ObjectType()
export class EditCommentOutputDto extends CoreOutputDto {}
