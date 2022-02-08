import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/core-output-dto.dto';

@InputType()
export class CreateRefreshTokenInputDto {
  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken: string;
}

@ObjectType()
export class CreateRefreshTokenOutputDto extends CoreOutputDto {
  @Field(() => String, { nullable: true })
  accessToken?: string;

  @Field(() => String, { nullable: true })
  refreshToken?: string;
}
