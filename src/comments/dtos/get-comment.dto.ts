import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { Comments } from '../entities/comments.entity';

@InputType()
export class GetCommentInputDto extends PickType(Comments, ['id']) {}

@ObjectType()
export class GetCommentOutputDto extends CoreOutputDto {
  @Field(() => Comments)
  data?: Comments;
}
