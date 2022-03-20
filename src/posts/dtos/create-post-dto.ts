import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { ArrayMaxSize, IsArray, IsString, Length } from 'class-validator';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { Posts } from '../entities/posts.entity';

@InputType()
export class CreatePostInputDto extends PartialType(
  PickType(Posts, ['address', 'placeId']),
) {
  @Field((type) => String)
  @IsString()
  @Length(0, 300)
  contents: string;

  @Field(() => [String])
  @IsArray()
  @ArrayMaxSize(5)
  photoUrls: string[];
}

@ObjectType()
export class CreatePostOutputDto extends CoreOutputDto {}
