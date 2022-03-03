/* eslint-disable  */
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateAccountInputDto,
  CreateAccountOutputDto,
} from './dtos/craete-account.dto';
import { UUID } from './entities/users-profile.entity';
import { UsersService } from './users.service';
import { AuthUser, GqlAuthGuard } from 'src/auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { EditProfileInputDto, EditProfileOutputDto } from './dtos/edit-profile.dto';
import { GetUserInputDto, GetUserOutputDto } from './dtos/get-user.dto';
import { args } from 'src/common/constants';
import { MailService } from 'src/mail/mail.service';
import { CoreOutputDto, CoreUserOutputDto } from 'src/common/dtos/core-output.dto';
import { CreateVerificationInputDto, VerifyEmailAndCodeInputDto } from './dtos/email-verification';

@Resolver((of) => UUID)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private mailService: MailService
    ) {}

  @Mutation(() => CreateAccountOutputDto)
  createLocalAccount(@Args(args) args: CreateAccountInputDto):Promise<CreateAccountOutputDto> {
    return this.usersService.createLocalAccount(args);
  }

  @Mutation(()=> EditProfileOutputDto)
  @UseGuards(GqlAuthGuard)
  editProfile(@AuthUser() userId:UUID, @Args(args) args: EditProfileInputDto):Promise<EditProfileOutputDto>{
    return this.usersService.editProfile(userId, args)
  }

  @Query(()=>GetUserOutputDto)
  @UseGuards(GqlAuthGuard)
  getProfile(@AuthUser() authUser:UUID, @Args(args) args:GetUserInputDto):Promise<GetUserOutputDto>{
    return this.usersService.getProfile(authUser, args)
  }

  @Mutation(()=>CoreOutputDto)
  createVerification(@Args(args) args:CreateVerificationInputDto):Promise<CoreOutputDto>{
    return this.mailService.createMailVerification(args);
  }
  @Query(()=>CoreOutputDto)
  verifyEmailAndCode(@Args(args) args:VerifyEmailAndCodeInputDto): Promise<CoreOutputDto>{
    return this.mailService.verifyEmailAndCode(args)
  }

  @Query(()=>CoreUserOutputDto)
  @UseGuards(GqlAuthGuard)
  me(@AuthUser() userId:UUID):Promise<CoreUserOutputDto>{
    return this.usersService.me(userId)
  }

  //@UseGuards(GqlAuthGuard)
  @Query(()=>Boolean)
  test(){
    return true
  }
}
