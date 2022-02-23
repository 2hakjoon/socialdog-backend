import { Injectable } from '@nestjs/common';
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
import { secret } from './key.secret';

interface IKakaoLoginResponse {
  data: {
    id: string;
    expiresInMillis: number;
    expires_in: number;
    app_id: number;
    appId: number;
  };
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
  ) {}

  async localLogin({
    email,
    password,
  }: LoginInputDto): Promise<LoginOutputDto> {
    try {
      const authLocal = await this.AuthLoalRepository.findOne(
        { email },
        { select: ['id', 'password', 'userId'] },
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
      const access_token = this.jwtService.sign({ id: authLocal.userId });
      const refresh_token = this.jwtService.sign(
        { id: authLocal.userId },
        { expiresIn: '182d' },
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

  async reissuanceAccessToken({
    accessToken,
    refreshToken,
  }: ReissueAccessTokenInputDto): Promise<ReissueAccessTokenOutputDto> {
    try {
      const decodedToken = this.jwtService.decode(accessToken);
      const authLocal = await this.AuthLoalRepository.findOne({ refreshToken });
      if (!authLocal) {
        return {
          ok: false,
          error: '리프레시 토큰이 일치하지 않습니다.',
        };
      }
      if (authLocal.id !== decodedToken['id']) {
        return {
          ok: false,
          error: '엑세스 토큰이 일치하지 않습니다.',
        };
      }
      const newAccessToken = this.jwtService.sign({ id: authLocal.userId });
      return {
        ok: true,
        accessToken: newAccessToken,
      };
    } catch (e) {
      return {
        ok: false,
        error: '엑세스 재발급에 실패하였습니다.',
      };
    }
  }
  async kakaoLogin(kakaoTokens: KakaoLoginInputDto): Promise<LoginOutputDto> {
    console.log(kakaoTokens);
    try {
      const { data: kakaoResponse }: IKakaoLoginResponse = await axios(
        'https://kapi.kakao.com/v1/user/access_token_info',
        { headers: { Authorization: `Bearer ${kakaoTokens.accessToken}` } },
      );
      if (!kakaoResponse.id) {
        return {
          ok: false,
        };
      }
      const authKakaoUser = await this.AuthKakaoRepository.findOne({
        kakaoId: kakaoResponse.id,
      });
      //로그인 한 적이 없을때
      if (!authKakaoUser) {
        const user = await this.userProfileRepository.save(
          await this.userProfileRepository.create({
            loginStrategy: LoginStrategy.KAKAO,
          }),
        );
        console.log(user);
        const access_token = this.jwtService.sign({ id: user.id });
        const refresh_token = this.jwtService.sign(
          { id: user.id },
          { expiresIn: '182d' },
        );
        await this.AuthKakaoRepository.save(
          await this.AuthKakaoRepository.create({
            kakaoId: kakaoResponse.id,
            userId: user.id,
            refreshToken: refresh_token,
          }),
        );
        return {
          ok: true,
          accessToken: access_token,
          refreshToken: refresh_token,
        };
      }

      const access_token = this.jwtService.sign({ id: authKakaoUser.userId });
      const refresh_token = this.jwtService.sign(
        { id: authKakaoUser.id },
        { expiresIn: '182d' },
      );
      await this.AuthKakaoRepository.update(authKakaoUser.id, {
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
        error: '카카오 로그인 도중 에러가 발생했습니다.',
      };
    }
  }
}
