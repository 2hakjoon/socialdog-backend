/* eslint-disable  */
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateAccountInputDto,
  CreateAccountOutputDto,
} from './dtos/craete-account.dto';
import { UserProfile } from './entities/users-profile.entity';
import { UsersService } from './users.service';
import { AuthUser, GqlAuthGuard } from 'src/auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { EditProfileInputDto, EditProfileOutputDto } from './dtos/edit-profile.dto';
import { GetUserInputDto, GetUserOutputDto } from './dtos/get-user.dto';
import { args } from 'src/common/constants';
import { MailService } from 'src/mail/mail.service';
import { CoreOutputDto, CoreUserOutputDto } from 'src/common/dtos/core-output.dto';
import { CreateVerificationInputDto, VerifyEmailAndCodeInputDto } from './dtos/email-verification';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@Resolver((of) => UserProfile)
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
  editProfile(@AuthUser() user:UserProfile, @Args(args) args: EditProfileInputDto,@Args('file', {type:()=>GraphQLUpload, nullable:true}) file:FileUpload ):Promise<EditProfileOutputDto>{
    return this.usersService.editProfile(user, args, file)
  }

  @Query(()=>GetUserOutputDto)
  getProfile(@Args(args) args:GetUserInputDto):Promise<GetUserOutputDto>{
    return this.usersService.getProfile(args)
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
  me(@AuthUser() user:UserProfile):Promise<CoreUserOutputDto>{
    return this.usersService.me(user)
  }

  //@UseGuards(GqlAuthGuard)
  @Query(()=>Boolean)
  test(){
    return true
  }
}
