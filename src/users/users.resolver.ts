/* eslint-disable  */
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateAccountInputDto,
  CreateAccountOutputDto,
} from './dtos/craete-account.dto';
import { LoginInputDto, LoginOutputDto } from './dtos/login.dto';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Mutation((returns) => CreateAccountOutputDto)
  createAccount(@Args('input') createAccountInputDto: CreateAccountInputDto) {
    return this.usersService.createAccount(createAccountInputDto);
  }

  @Query((returns) => LoginOutputDto)
  login(@Args('input') loginInputDto: LoginInputDto) {
    return this.usersService.login(loginInputDto);
  }

  @Query((returns) => Boolean)
  test() {
    return true;
  }
}
