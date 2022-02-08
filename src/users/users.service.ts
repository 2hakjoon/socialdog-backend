import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateAccountInputDto,
  CreateAccountOutputDto,
} from './dtos/craete-account.dto';
import { User } from './entities/users.entity';
import * as bcrypt from 'bcrypt';
import {
  EditProfileInputDto,
  EditProfileOutputDto,
} from './dtos/edit-profile.dto';
import {
  GetProfileInputDto,
  GetProfileOutputDto,
} from './dtos/get-profile.dto';

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

  async getProfile({
    userId,
  }: GetProfileInputDto): Promise<GetProfileOutputDto> {
    console.log(userId);
    try {
      const userInfo = await this.usersRepository.findOne({ id: userId });
      if (!userInfo) {
        return {
          ok: false,
          error: '유저가 존재하지 않습니다.',
        };
      }
      return {
        ok: true,
        data: userInfo,
      };
    } catch (e) {
      return {
        ok: false,
        error: '유저정보 조회에 실패했습니다.',
      };
    }
  }

  async editProfile(
    user: User,
    editProfileInputDto: EditProfileInputDto,
  ): Promise<EditProfileOutputDto> {
    try {
      const userInfo = await this.usersRepository.findOne({ id: user.id });
      if (!userInfo) {
        return {
          ok: false,
          error: '사용자를 찾을 수 없습니다.',
        };
      }
      let hashedPassword = '';
      if (editProfileInputDto.password) {
        hashedPassword = await bcrypt.hash(editProfileInputDto.password, 10);
      }
      await this.usersRepository.update(user.id, {
        ...user,
        ...editProfileInputDto,
        password: hashedPassword,
      });
      return {
        ok: true,
      };
    } catch (E) {
      return {
        ok: false,
        error: '프로필 정보 수정에 실패했습니다.',
      };
    }
  }
}
