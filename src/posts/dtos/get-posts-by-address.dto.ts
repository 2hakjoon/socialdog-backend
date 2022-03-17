import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CorePostsOutputDto } from 'src/common/dtos/core-output.dto';
@InputType()
export class GetPostsByAddressInputDto {
  @Field(() => String)
  @IsString()
  address: string;
}

@ObjectType()
export class getPostsByAddressOutputDto extends CorePostsOutputDto {}
