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
import { EditProfileInputDto, EditProfileOutputDto } from './dtos/edit-profile.dto';
import { GetUserInputDto, GetUserOutputDto } from './dtos/get-user.dto';
import { args } from 'src/common/constants';

@Resolver((of) => User)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private localStrategy : LocalStrategy,
    ) {}

  @Mutation(() => CreateAccountOutputDto)
  createAccount(@Args(args) args: CreateAccountInputDto):Promise<CreateAccountOutputDto> {
    return this.usersService.createAccount(args);
  }

  @Mutation(() => LoginOutputDto)
  login(@Args(args) args:LoginInputDto):Promise<LoginOutputDto>{
    console.log(args)
    return this.localStrategy.login(args);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(()=> EditProfileOutputDto)
  editProfile(@AuthUser() user:User, @Args(args) args: EditProfileInputDto):Promise<EditProfileOutputDto>{
    return this.usersService.editProfile(user, args)
  }

  @Query(()=>GetUserOutputDto)
  getProfile(@Args(args) args:GetUserInputDto):Promise<GetUserOutputDto>{
    console.log(args)
    return this.usersService.getProfile(args)
  }

  @UseGuards(GqlAuthGuard)
  @Query(()=>Boolean)
  test(@AuthUser() user: User){
    console.log(user)
    return true
  }
}
