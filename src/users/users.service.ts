import { Injectable } from '@nestjs/common';
import {
  CreateAccountInputDto,
  CreateAccountOutputDto,
} from './dtos/craete-account.dto';

@Injectable()
export class UsersService {
  async createAccount({
    username,
    email,
    password,
  }: CreateAccountInputDto): Promise<CreateAccountOutputDto> {
    console.log(username, email, password);
    return {
      ok: true,
    };
  }
}
