import { InputType, ObjectType } from '@nestjs/graphql';
import { CorePostsOutputDto } from 'src/common/dtos/core-output.dto';

@InputType()
export class GetMyLikedPostsInputDto {}

@ObjectType()
export class GetMyLikedPostsOutputDto extends CorePostsOutputDto {}
