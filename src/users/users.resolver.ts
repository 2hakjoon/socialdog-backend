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
import { RequestSubscribeInputDto, RequestSubscribeOutputDto } from './dtos/request-subscribe.dto';
import { ResponseSubscribeInputDto, ResponseSubscribeOutputDto } from './dtos/response-subscribe.dto';
import { ChangeBlockStateInputDto, ChangeBlockStateOutputDto } from './dtos/change-block-state.dto';

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
  editProfile(@AuthUser() user:UUID, @Args(args) args: EditProfileInputDto):Promise<EditProfileOutputDto>{
    return this.usersService.editProfile(user, args)
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
  me(@AuthUser() user:UUID):Promise<CoreUserOutputDto>{
    return this.usersService.me(user)
  }

  @Mutation(()=>RequestSubscribeOutputDto)
  @UseGuards(GqlAuthGuard)
  requestSubscribe(@AuthUser() user:UUID, @Args(args) args:RequestSubscribeInputDto):Promise<RequestSubscribeOutputDto>{
    return this.usersService.requestSubscribe(user, args)
  }

  @Mutation(()=>ResponseSubscribeOutputDto)
  @UseGuards(GqlAuthGuard)
  responseSubscribe(@AuthUser() user:UUID, @Args(args) args:ResponseSubscribeInputDto):Promise<ResponseSubscribeOutputDto>{
    return this.usersService.responseSubscribe(user, args)
  }

  @Mutation(()=>ChangeBlockStateOutputDto)
  @UseGuards(GqlAuthGuard)
  changeBlockState(@AuthUser() user:UUID, @Args(args) args:ChangeBlockStateInputDto):Promise<ChangeBlockStateOutputDto>{
    return this.usersService.changeBlockState(user, args)
  }
  //@UseGuards(GqlAuthGuard)
  @Query(()=>Boolean)
  test(){
    return true
  }
}
