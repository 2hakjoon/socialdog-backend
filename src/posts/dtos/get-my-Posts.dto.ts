import { InputType, ObjectType } from '@nestjs/graphql';
import { CorePostsOutputDto } from 'src/common/dtos/core-output.dto';
import { CorePagination } from 'src/common/dtos/core-pagination.dto';

@InputType()
export class GetMyPostsInputDto extends CorePagination {}

@ObjectType()
export class GetMyPostsOutputDto extends CorePostsOutputDto {}
