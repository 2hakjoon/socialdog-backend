import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { Posts } from '../entities/posts.entity';

@ObjectType()
export class GetSubscribingPostsOutputDto extends CoreOutputDto {
  @Field((type) => [Posts])
  data?: Posts[];
}
