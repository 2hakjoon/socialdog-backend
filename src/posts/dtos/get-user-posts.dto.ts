import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { UUID } from 'src/users/entities/users-profile.entity';
import { Posts } from '../entities/posts.entity';

@InputType()
export class GetUserPostsInputDto {
  @Field((type) => String)
  @IsUUID()
  userId: string;
}

@ObjectType()
export class GetUserPostsOutputDto extends CoreOutputDto {
  @Field((type) => [Posts])
  data?: Posts[];
}
