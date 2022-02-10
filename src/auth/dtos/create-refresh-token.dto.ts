import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';

@InputType()
export class ReissueRefreshTokenInputDto {
  @Field(() => String)
  @IsString()
  accessToken: string;

  @Field(() => String)
  @IsString()
  refreshToken: string;
}

@ObjectType()
export class ReissueRefreshTokenOutputDto extends CoreOutputDto {
  @Field(() => String, { nullable: true })
  accessToken?: string;
}
