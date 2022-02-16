import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { args } from '../common/constants';
import { LoginInputDto, LoginOutputDto } from './dtos/login.dto';
import { KakaoLoginInputDto } from './dtos/kakao-login.dto';
import {
  ReissueAccessTokenInputDto,
  ReissueAccessTokenOutputDto,
} from './dtos/create-refresh-token.dto';

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
  localLogin(@Args(args) args:LoginInputDto):Promise<LoginOutputDto>{
    return this.authService.localLogin(args);
  }

  @Mutation(() => LoginOutputDto)
  kakaoLogin(@Args(args) args: KakaoLoginInputDto): Promise<LoginOutputDto> {
    return this.authService.kakaoLogin(args);
  }
}
