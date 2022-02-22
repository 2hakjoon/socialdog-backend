import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsArray } from 'class-validator';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { Posts } from '../entities/posts.entity';

@InputType()
export class CreatePostInputDto extends PickType(Posts, [
  'address',
  'contents',
  'placeId',
]) {
  @Field(() => [String])
  @IsArray()
  photos: string[];
}

@ObjectType()
export class CreatePostOutputDot extends CoreOutputDto {}
