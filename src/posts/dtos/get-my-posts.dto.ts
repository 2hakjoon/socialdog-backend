import { InputType, ObjectType } from '@nestjs/graphql';
import { CorePostsOutputDto } from 'src/common/dtos/core-output.dto';

@ObjectType()
export class GetMyPostsOutputDto extends CorePostsOutputDto {}