import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginInputDto, LoginOutputDto } from './dtos/login.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import {
  ReissueAccessTokenInputDto,
  ReissueAccessTokenOutputDto,
} from './dtos/create-refresh-token.dto';
import { KakaoLoginInputDto } from './dtos/kakao-login.dto';
import axios from 'axios';
import { AuthLocal } from './entities/auth-local.entity';
import { AuthKakao } from './entities/auth-kakao.entity';
import {
  LoginStrategy,
  UserProfile,
  UUID,
} from 'src/users/entities/users-profile.entity';
import { CONFIG_OPTIONS } from 'src/common/utils/constants';
import {
  UpdateAuthKakaoAcceptTermInputDto,
  UpdateAuthKakaoAcceptTermOutputDto,
  UpdateAuthLocalAcceptTermInputDto,
  UpdateAuthLocalAcceptTermOutputDto,
} from './dtos/update-accept-term.dto';

interface IKakaoLoginResponse {
  data: {
    id: string;
    expiresInMillis: number;
    expires_in: number;
    app_id: number;
    appId: number;
  };
}

interface IAccessTokenArgs {
  id: string;
  loginStrategy: LoginStrategy;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
    @InjectRepository(AuthLocal)
    private AuthLoalRepository: Repository<AuthLocal>,
    @InjectRepository(AuthKakao)
    private AuthKakaoRepository: Repository<AuthKakao>,
    private jwtService: JwtService,
    @Inject(CONFIG_OPTIONS) private options,
  ) {}

  async localLogin({
    email,
    password,
    acceptTerms,
  }: LoginInputDto): Promise<LoginOutputDto> {
    try {
      const authLocal = await this.AuthLoalRepository.findOne(
        { email },
        {
          loadRelationIds: { relations: ['user'] },
        },
      );

      if (!authLocal) {
        return {
          ok: false,
          error: '로그인 정보가 잘못되었습니다.',
        };
      }
      const isPasswordCorrect = await bcrypt.compare(
        password,
        authLocal.password,
      );
      if (!isPasswordCorrect) {
        return {
          ok: false,
          error: '로그인 정보가 잘못되었습니다.',
        };
      }
      //약관에 동의 가 안되어있다면,
      if (!authLocal.acceptTerms && acceptTerms === false) {
        return { ok: true, acceptTerms: false };
      }
      const access_token = this.jwtService.sign({
        id: authLocal.user,
        loginStrategy: LoginStrategy.LOCAL,
      });
      const refresh_token = this.jwtService.sign(
        {},
        {
          expiresIn: this.options.refreshTokenExpiresIn,
        },
      );
      await this.AuthLoalRepository.update(authLocal.id, {
        ...authLocal,
        refreshToken: refresh_token,
        acceptTerms: authLocal.acceptTerms || acceptTerms,
      });
      return {
        ok: true,
        accessToken: access_token,
        refreshToken: refresh_token,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '로그인에 실패하였습니다.',
      };
    }
  }

  async kakaoLogin({
    acceptTerms,
    accessToken,
  }: KakaoLoginInputDto): Promise<LoginOutputDto> {
    // console.log(kakaoTokens);
    try {
      const { data: kakaoResponse }: IKakaoLoginResponse = await axios(
        'https://kapi.kakao.com/v1/user/access_token_info',
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      if (!kakaoResponse.id) {
        return {
          ok: false,
          error: '카카오 로그인에 실패했습니다.',
        };
      }
      const authKakaoUser = await this.AuthKakaoRepository.findOne(
        {
          kakaoId: kakaoResponse.id,
        },
        {
          loadRelationIds: { relations: ['user'] },
        },
      );
      // console.log(authKakaoUser);

      //최초 로그인상태, 회원가입을 의미함
      if (!authKakaoUser) {
        //약관에 동의를 안했다면 얼리리턴, acceptTerms:false,
        if (!acceptTerms) {
          return {
            ok: true,
            acceptTerms: false,
          };
        }
        const user = await this.userProfileRepository.save(
          await this.userProfileRepository.create({
            loginStrategy: LoginStrategy.KAKAO,
            username: `사용자-${Math.round(Math.random() * 100000000)}`,
          }),
        );
        const access_token = this.jwtService.sign({
          id: user.id,
          loginStrategy: LoginStrategy.KAKAO,
        });
        const refresh_token = this.jwtService.sign(
          {},
          {
            expiresIn: this.options.refreshTokenExpiresIn,
          },
        );
        await this.AuthKakaoRepository.save(
          await this.AuthKakaoRepository.create({
            kakaoId: kakaoResponse.id,
            user: user,
            refreshToken: refresh_token,
            acceptTerms,
          }),
        );
        return {
          ok: true,
          accessToken: access_token,
          refreshToken: refresh_token,
        };
      }

      //계정이 있는데, 약관동의가 안되어있고, 로그인시 약관동의를 안했을경우.
      if (authKakaoUser.acceptTerms === false && acceptTerms === false) {
        return {
          ok: true,
          acceptTerms: false,
        };
      }

      const access_token = this.jwtService.sign({
        id: authKakaoUser.user,
        loginStrategy: LoginStrategy.KAKAO,
      });
      const refresh_token = this.jwtService.sign(
        {},
        {
          expiresIn: this.options.refreshTokenExpiresIn,
        },
      );
      await this.AuthKakaoRepository.update(authKakaoUser.id, {
        refreshToken: refresh_token,
        acceptTerms: authKakaoUser.acceptTerms || acceptTerms,
      });
      return {
        ok: true,
        accessToken: access_token,
        refreshToken: refresh_token,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '카카오 로그인 도중 에러가 발생했습니다.',
      };
    }
  }

  async reissuanceAccessToken({
    accessToken,
    refreshToken,
  }: ReissueAccessTokenInputDto): Promise<ReissueAccessTokenOutputDto> {
    try {
      this.jwtService.verify(refreshToken, this.options.secretKey);

      const decodedAccessToken = this.jwtService.decode(
        accessToken,
      ) as IAccessTokenArgs;
      // console.log(decodedToken);
      const authLocal = await this.getAuthInfo(
        decodedAccessToken.loginStrategy,
        refreshToken,
      );
      if (!authLocal) {
        return {
          ok: false,
          error: '리프레시 토큰이 일치하지 않습니다.',
        };
      }
      console.log(authLocal);
      if (authLocal.user !== decodedAccessToken['id']) {
        return {
          ok: false,
          error: '엑세스 토큰이 일치하지 않습니다.',
        };
      }
      const newAccessToken = this.jwtService.sign({
        id: authLocal.user,
        loginStrategy: decodedAccessToken.loginStrategy,
      });
      return {
        ok: true,
        accessToken: newAccessToken,
      };
    } catch (e) {
      console.log(e.message);
      if (e.message === 'jwt expired') {
        return {
          ok: false,
          isRefreshTokenExpired: true,
          error: '토큰이 만료되었습니다. 다시 로그인해주세요.',
        };
      }
      return {
        ok: false,
        error: '엑세스 재발급에 실패하였습니다.',
      };
    }
  }

  async getAuthInfo(loginStrategy: LoginStrategy, refreshToken: string) {
    if (loginStrategy === LoginStrategy.KAKAO) {
      return this.AuthKakaoRepository.findOne(
        {
          refreshToken,
        },
        { loadRelationIds: { relations: ['user'] } },
      );
    } else if (loginStrategy === LoginStrategy.LOCAL) {
      return this.AuthLoalRepository.findOne(
        { refreshToken },
        { loadRelationIds: { relations: ['user'] } },
      );
    }
    return undefined;
  }

  async updateAuthKakaoAcceptTerm(
    { userId }: UUID,
    { acceptTerms }: UpdateAuthKakaoAcceptTermInputDto,
  ): Promise<UpdateAuthKakaoAcceptTermOutputDto> {
    try {
      await this.AuthKakaoRepository.update({ id: userId }, { acceptTerms });
      return { ok: true };
    } catch (e) {
      //console.log(e)
      return { ok: false, error: '약관 동의 중 오류가 발생했습니다.' };
    }
  }
  async updateAuthLocalAcceptTerm(
    { userId }: UUID,
    { acceptTerms }: UpdateAuthLocalAcceptTermInputDto,
  ): Promise<UpdateAuthLocalAcceptTermOutputDto> {
    try {
      await this.AuthLoalRepository.update({ id: userId }, { acceptTerms });
      return { ok: true };
    } catch (e) {
      //console.log(e)
      return { ok: false, error: '약관 동의 중 오류가 발생했습니다.' };
    }
  }
}
