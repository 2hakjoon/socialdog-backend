import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { Posts } from '../entities/posts.entity';

@InputType()
export class EditPostInputDto extends PartialType(
  PickType(Posts, ['address', 'contents', 'placeId']),
) {
  @Field((type) => String)
  @IsString()
  postId: string;
}

@ObjectType()
export class EditPostOutputDto extends CoreOutputDto {}
