import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { Comments } from '../entities/comments.entity';

@InputType()
export class GetReCommentsInputDto {
  @Field(() => String)
  @IsUUID()
  parentCommentId: string;
}

@ObjectType()
export class GetReCommentsOutputDto extends CoreOutputDto {
  @Field(() => [Comments])
  data?: Comments[];
}
