import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateAccountInputDto,
  CreateAccountOutputDto,
} from './dtos/craete-account.dto';
import { User } from './entities/users.entity';

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
    console.log(username, email, password);
    await this.usersRepository.save(
      await this.usersRepository.create({ username, email, password }),
    );
    return {
      ok: true,
    };
  }
}
