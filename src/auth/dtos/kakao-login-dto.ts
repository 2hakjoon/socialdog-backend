import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class KakaoLoginInputDto {
  @Field(() => String)
  @IsString()
  kakaoAccessToken: string;
}
