/* eslint-disable  */
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateAccountInputDto,
  CreateAccountOutputDto,
} from './dtos/craete-account.dto';
import { LoginInputDto, LoginOutputDto } from '../auth/dtos/login.dto';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';
import { LocalStrategy } from 'src/auth/strategy/auth.local';
import { AuthUser, GqlAuthGuard } from 'src/auth/auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver((of) => User)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private localStrategy : LocalStrategy,
    ) {}

  @Mutation((returns) => CreateAccountOutputDto)
  createAccount(@Args('input') createAccountInputDto: CreateAccountInputDto) {
    return this.usersService.createAccount(createAccountInputDto);
  }

  @Query((returns) => LoginOutputDto)
  login(@Args('input') LoginInputDto:LoginInputDto){
    return this.localStrategy.login(LoginInputDto);
  }

  @UseGuards(GqlAuthGuard)
  @Query(returns=>Boolean)
  test(@AuthUser() user: User){
    console.log(user)
    return true
  }
}
