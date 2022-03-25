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
} from 'src/users/entities/users-profile.entity';
import { CONFIG_OPTIONS } from 'src/common/utils/constants';

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

  async kakaoLogin(kakaoTokens: KakaoLoginInputDto): Promise<LoginOutputDto> {
    // console.log(kakaoTokens);
    try {
      const { data: kakaoResponse }: IKakaoLoginResponse = await axios(
        'https://kapi.kakao.com/v1/user/access_token_info',
        { headers: { Authorization: `Bearer ${kakaoTokens.accessToken}` } },
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

      //로그인 한 적이 없을때
      if (!authKakaoUser) {
        const user = await this.userProfileRepository.save(
          await this.userProfileRepository.create({
            username: `사용자-${Math.round(Math.random() * 100000000)}`,
          }),
        );
        // console.log(user);
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
          }),
        );
        return {
          ok: true,
          accessToken: access_token,
          refreshToken: refresh_token,
          isJoin: true,
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
      });
      return {
        ok: true,
        accessToken: access_token,
        refreshToken: refresh_token,
        isJoin: false,
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
}
