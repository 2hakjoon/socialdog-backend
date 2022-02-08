import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateAccountInputDto,
  CreateAccountOutputDto,
} from './dtos/craete-account.dto';
import { User } from './entities/users.entity';
import * as bcrypt from 'bcrypt';
import { LoginInputDto } from './dtos/login.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createAccount({
    username,
    email,
    password,
  }: CreateAccountInputDto): Promise<CreateAccountOutputDto> {
    //console.log(username, email, password);
    try {
      const isUserExists = await this.usersRepository.findOne({ email });
      if (isUserExists) {
        return {
          ok: false,
          error: '이미 존재하는 이메일입니다.',
        };
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.usersRepository.save(
        await this.usersRepository.create({
          username,
          email,
          password: hashedPassword,
        }),
      );
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '회원가입에 실패하였습니다.',
      };
    }
  }
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
      console.log(password, isPasswordCorrect);
      if (!isPasswordCorrect) {
        return {
          ok: false,
          error: '로그인 정보가 잘못되었습니다.',
        };
      }
      return {
        ok: true,
        token: 'token',
      };
    } catch (e) {
      return {
        ok: false,
        error: '로그인에 실패하였습니다.',
      };
    }
  }
}
