import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CorePostsOutputDto } from 'src/common/dtos/core-output.dto';

@InputType()
export class GetUserPostsInputDto {
  @Field((type) => String)
  @IsString()
  username: string;
}

@ObjectType()
export class GetUserPostsOutputDto extends CorePostsOutputDto {}
