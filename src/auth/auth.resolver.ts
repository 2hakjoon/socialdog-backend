import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { args } from '../common/utils/constants';
import { LoginInputDto, LoginOutputDto } from './dtos/login.dto';
import { KakaoLoginInputDto } from './dtos/kakao-login.dto';
import {
  ReissueAccessTokenInputDto,
  ReissueAccessTokenOutputDto,
} from './dtos/create-refresh-token.dto';
import {
  UpdateAuthKakaoAcceptTermInputDto,
  UpdateAuthKakaoAcceptTermOutputDto,
  UpdateAuthLocalAcceptTermInputDto,
  UpdateAuthLocalAcceptTermOutputDto,
} from './dtos/update-accept-term.dto';
import { UseGuards } from '@nestjs/common';
import { AuthUser, GqlAuthGuard } from './auth.guard';
import { UUID } from 'src/users/entities/users-profile.entity';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => ReissueAccessTokenOutputDto)
  reissueAccessToken(
    @Args(args) args: ReissueAccessTokenInputDto,
  ): Promise<ReissueAccessTokenOutputDto> {
    return this.authService.reissuanceAccessToken(args);
  }

  @Mutation(() => LoginOutputDto)
  localLogin(@Args(args) args: LoginInputDto): Promise<LoginOutputDto> {
    return this.authService.localLogin(args);
  }

  @Mutation(() => LoginOutputDto)
  kakaoLogin(@Args(args) args: KakaoLoginInputDto): Promise<LoginOutputDto> {
    return this.authService.kakaoLogin(args);
  }

  @Mutation(() => UpdateAuthKakaoAcceptTermOutputDto)
  @UseGuards(GqlAuthGuard)
  updateAuthKakaoAcceptTerm(
    @AuthUser() userId: UUID,
    @Args(args) args: UpdateAuthKakaoAcceptTermInputDto,
  ): Promise<UpdateAuthKakaoAcceptTermOutputDto> {
    return this.updateAuthKakaoAcceptTerm(userId, args);
  }

  @Mutation(() => UpdateAuthLocalAcceptTermOutputDto)
  @UseGuards(GqlAuthGuard)
  updateAuthLocalAcceptTerm(
    @AuthUser() userId: UUID,
    @Args(args) args: UpdateAuthLocalAcceptTermInputDto,
  ): Promise<UpdateAuthLocalAcceptTermOutputDto> {
    return this.updateAuthLocalAcceptTerm(userId, args);
  }
}
