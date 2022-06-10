import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsString } from 'class-validator';
import { Column } from 'typeorm';
import { AuthKakao } from '../entities/auth-kakao.entity';

@InputType()
export class KakaoLoginInputDto {
  @Field(() => String)
  @IsString()
  accessToken: string;

  @Field(() => String, { nullable: true })
  @IsString()
  accessTokenExpiresAt?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  refreshToken?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  refreshTokenExpiresAt?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  scopes?: string;

  @Field(() => Boolean)
  @Column({ default: false })
  @IsBoolean()
  acceptTerms: boolean;
}
