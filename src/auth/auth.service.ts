import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginInputDto } from './dtos/login.dto';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import {
  CreateRefreshTokenInputDto,
  CreateRefreshTokenOutputDto,
} from './dtos/create-refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginInputDto) {
    try {
      const user = await this.usersRepository.findOne({ email });
      if (!user) {
        return {
          ok: false,
          error: '로그인 정보가 잘못되었습니다.',
        };
      }
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return {
          ok: false,
          error: '로그인 정보가 잘못되었습니다.',
        };
      }
      const access_token = this.jwtService.sign({ id: user.id });
      const refresh_token = this.jwtService.sign({}, { expiresIn: '14d' });
      await this.usersRepository.update(user.id, {
        ...user,
        refreshToken: refresh_token,
      });
      console.log(refresh_token);
      return {
        ok: true,
        token: access_token,
      };
    } catch (e) {
      //console.log(e)
      return {
        ok: false,
        error: '로그인에 실패하였습니다.',
      };
    }
  }
  async refeshToken({
    accessToken,
    refreshToken,
  }: CreateRefreshTokenInputDto): Promise<CreateRefreshTokenOutputDto> {
    return {
      ok: true,
    };
  }
}
