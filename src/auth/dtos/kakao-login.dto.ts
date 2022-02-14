import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { Column } from 'typeorm';
import { AuthKakao } from '../entities/auth-kakao.entity';

@InputType()
export class KakaoLoginInputDto {
  @Field(() => String)
  @Column()
  @IsString()
  accessToken: string;

  @Field(() => String)
  @Column()
  @IsString()
  accessTokenExpiresAt: string;

  @Field(() => String)
  @Column()
  @IsString()
  refreshToken: string;

  @Field(() => String)
  @Column()
  @IsString()
  refreshTokenExpiresAt: string;

  @Field(() => String)
  @Column()
  @IsString()
  scopes: string;
}
