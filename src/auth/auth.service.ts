import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginInputDto, LoginOutputDto } from './dtos/login.dto';
import { Repository } from 'typeorm';
import { UserProfile } from 'src/users/entities/users-profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import {
  ReissueAccessTokenInputDto,
  ReissueAccessTokenOutputDto,
} from './dtos/create-refresh-token.dto';
import { KakaoLoginInputDto } from './dtos/kakao-login.dto';
import axios from 'axios';
import { AuthLocal } from './entities/auth-local.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserProfile)
    private usersProfileRepository: Repository<UserProfile>,
    @InjectRepository(AuthLocal)
    private usersAuthLoalRepository: Repository<AuthLocal>,
    private jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginInputDto): Promise<LoginOutputDto> {
    try {
      const user = await this.usersAuthLoalRepository.findOne(
        { email },
        { select: ['id', 'password'] },
      );
      if (!user) {
        return {
          ok: false,
          error: '로그인 정보가 잘못되었습니다.',
        };
      }
      console.log(user);
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return {
          ok: false,
          error: '로그인 정보가 잘못되었습니다.',
        };
      }
      const access_token = this.jwtService.sign({ id: user.id });
      const refresh_token = this.jwtService.sign({}, { expiresIn: '182d' });
      await this.usersAuthLoalRepository.update(user.id, {
        ...user,
        refreshToken: refresh_token,
      });
      console.log(refresh_token);
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
      console.log(decodedToken);
      const user = await this.usersAuthLoalRepository.findOne({ refreshToken });
      if (!user) {
        return {
          ok: false,
          error: '리프레시 토큰이 일치하지 않습니다.',
        };
      }
      if (user.id !== decodedToken['id']) {
        return {
          ok: false,
          error: '엑세스 토큰이 일치하지 않습니다.',
        };
      }
      const newAccessToken = this.jwtService.sign({ id: user.id });
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
  async kakaoLogin({
    kakaoAccessToken,
  }: KakaoLoginInputDto): Promise<LoginOutputDto> {
    try {
      const res = await axios(
        'https://kapi.kakao.com/v1/user/access_token_info',
        { headers: { Authorization: `Bearer ${kakaoAccessToken}` } },
      );
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '카카오 로그인 도중 에러가 발생했습니다.',
      };
    }
  }
}
