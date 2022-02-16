/* eslint-disable  */
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateAccountInputDto,
  CreateAccountOutputDto,
} from './dtos/craete-account.dto';
import { LoginInputDto, LoginOutputDto } from '../auth/dtos/login.dto';
import { UserProfile } from './entities/users-profile.entity';
import { UsersService } from './users.service';
import { LocalStrategy } from 'src/auth/strategy/auth.local';
import { AuthUser, GqlAuthGuard } from 'src/auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { EditProfileInputDto, EditProfileOutputDto } from './dtos/edit-profile.dto';
import { GetUserInputDto, GetUserOutputDto } from './dtos/get-user.dto';
import { args } from 'src/common/constants';
import { MailService } from 'src/mail/mail.service';
import { CoreOutputDto, CoreUserOutputDto } from 'src/common/dtos/core-output.dto';
import { CreateVerificationInputDto, VerifyEmailAndCodeInputDto } from './dtos/email-verification';
import { FileUpload } from 'src/common/dtos/file-upload.dto';
import { GraphQLUpload } from 'graphql-upload';

@Resolver((of) => UserProfile)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private localStrategy : LocalStrategy,
    private mailService: MailService
    ) {}

  @Mutation(() => CreateAccountOutputDto)
  createLocalAccount(@Args(args) args: CreateAccountInputDto):Promise<CreateAccountOutputDto> {
    return this.usersService.createLocalAccount(args);
  }

  @Mutation(() => LoginOutputDto)
  localLogin(@Args(args) args:LoginInputDto):Promise<LoginOutputDto>{
    return this.localStrategy.localLogin(args);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(()=> EditProfileOutputDto)
  editProfile(@AuthUser() user:UserProfile, @Args(args) args: EditProfileInputDto):Promise<EditProfileOutputDto>{
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

  @Mutation(() => Boolean)
async uploadFile(
  @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
): Promise<boolean> {
  console.log(file)
  // const result = await this._awsService.uploadToS3({
  //   Key: 'fdjksfljs',
  //   ContentEncoding: file.encoding,
  //   Body: file.createReadStream(),
  //   ContentType: file.mimetype,
  // });
  // console.log(result);
  return true;
}
}
