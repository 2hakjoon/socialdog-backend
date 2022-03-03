import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { CorePagination } from 'src/common/dtos/core-pagination.dto';
import { Posts } from '../entities/posts.entity';

@InputType()
export class GetMyPostsInputDto extends CorePagination {}

@ObjectType()
export class GetMyPostsOutputDto extends CoreOutputDto {
  @Field((type) => [Posts])
  data?: Posts[];
}
