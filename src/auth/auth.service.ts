import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  //Todos
  //비밀번호 암호화 작업 후 진행예정
  // async validateUser(username: string, password: string): Promise<any> {
  //   const user = await this.usersService.findOne(username);
  //   if (user && user.password === password) {
  //     const { password, ...result } = user;
  //     return result;
  //   }
  //   return null;
  // }
}
