import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { ArrayMaxSize, IsArray, IsString } from 'class-validator';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { Posts } from '../entities/posts.entity';

@InputType()
export class EditPostInputDto extends PartialType(
  PickType(Posts, ['address', 'contents', 'placeId']),
) {
  @Field((type) => String)
  @IsString()
  postId: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @ArrayMaxSize(5)
  photoUrls?: string[];
}

@ObjectType()
export class EditPostOutputDto extends CoreOutputDto {}
