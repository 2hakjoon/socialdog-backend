import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { UUID } from 'src/users/entities/users-profile.entity';
import { Comments } from '../entities/comments.entity';

@InputType()
export class CreateReCommentInputDto extends PickType(Comments, ['content']) {
  @Field(() => UUID)
  @IsString()
  parentCommentId: UUID;
}

@ObjectType()
export class CreateReCommentOutputDto extends CoreOutputDto {}
