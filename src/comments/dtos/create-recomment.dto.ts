import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { Comments } from '../entities/comments.entity';

@InputType()
export class CreateReCommentInputDto extends PickType(Comments, ['content']) {
  @Field(() => String)
  @IsUUID()
  parentCommentId: string;

  @Field(() => String)
  @IsUUID()
  postId: string;
}

@ObjectType()
export class CreateReCommentOutputDto extends CoreOutputDto {}
