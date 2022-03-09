import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { CorePagination } from 'src/common/dtos/core-pagination.dto';
import { Posts } from '../entities/posts.entity';

@InputType()
export class GetUserPostsInputDto extends CorePagination {
  @Field((type) => String)
  @IsString()
  username: string;
}

@ObjectType()
export class GetUserPostsOutputDto extends CoreOutputDto {
  @Field((type) => [Posts])
  data?: Posts[];
}
