import { Field, ObjectType } from '@nestjs/graphql';
import { CorePostsOutputDto } from 'src/common/dtos/core-output.dto';

@ObjectType()
export class GetSubscribingPostsOutputDto extends CorePostsOutputDto {}
