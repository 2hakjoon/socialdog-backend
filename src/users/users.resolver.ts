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
import { MailService } from 'src/mail/mail.service';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { CreateVerificationInputDto, VerifyEmailAndCodeInputDto } from './dtos/email-verification';

@Resolver((of) => User)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private localStrategy : LocalStrategy,
    private mailService: MailService
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

  @Mutation(()=>CoreOutputDto)
  createVerification(@Args(args) args:CreateVerificationInputDto):Promise<CoreOutputDto>{
    return this.mailService.createMailVerification(args);
  }
  @Mutation(()=>CoreOutputDto)
  verifiyEmailAndCode(@Args(args) args:VerifyEmailAndCodeInputDto): Promise<CoreOutputDto>{
    return this.mailService.verifyEmailAndCode(args)
  }

  @UseGuards(GqlAuthGuard)
  @Query(()=>Boolean)
  test(@AuthUser() user: User){
    this.mailService.sendMail('2hakjoon@gmail.com', 123456)
    console.log(user)
    return true
  }
}
