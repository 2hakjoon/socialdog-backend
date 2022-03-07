import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import {
  CreateAccountInputDto,
  CreateAccountOutputDto,
} from './dtos/craete-account.dto';
import {
  LoginStrategy,
  UserProfile,
  UUID,
} from './entities/users-profile.entity';
import * as bcrypt from 'bcrypt';
import {
  EditProfileInputDto,
  EditProfileOutputDto,
} from './dtos/edit-profile.dto';
import { GetUserInputDto, GetUserOutputDto } from './dtos/get-user.dto';
import { MailService } from 'src/mail/mail.service';
import { CoreUserOutputDto } from 'src/common/dtos/core-output.dto';
import { AuthLocal } from 'src/auth/entities/auth-local.entity';
import { UploadService } from 'src/upload/upload.service';
import { SubscribesService } from 'src/subscribes/subscribes.service';
import { BlockState } from 'src/subscribes/entities/subscribes.entity';
import {
  FindUserByUsernameInputDto,
  FindUserByUsernameOutputDto,
} from './dtos/find-user-by-username.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserProfile)
    private usersProfileRepository: Repository<UserProfile>,
    @InjectRepository(AuthLocal)
    private authLoalRepository: Repository<AuthLocal>,
    private subscribesService: SubscribesService,
    private uploadService: UploadService,
    private mailService: MailService,
  ) {}

  async createLocalAccount({
    email,
    password,
    code,
  }: CreateAccountInputDto): Promise<CreateAccountOutputDto> {
    try {
      const isUserExists = await this.authLoalRepository.findOne({
        email,
      });
      if (isUserExists) {
        return {
          ok: false,
          error: '이미 존재하는 이메일입니다.',
        };
      }
      const isCodeValid = await this.mailService.verifyEmailAndCode({
        email,
        code,
      });
      if (!isCodeValid.ok) {
        return isCodeValid;
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.usersProfileRepository.save(
        await this.usersProfileRepository.create({
          loginStrategy: LoginStrategy.LOCAL,
        }),
      );

      await this.authLoalRepository.save(
        await this.authLoalRepository.create({
          email,
          password: hashedPassword,
          user: user.id,
        }),
      );

      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '회원가입에 실패하였습니다.',
      };
    }
  }

  async getProfile(
    { userId: authUser }: UUID,
    { userId }: GetUserInputDto,
  ): Promise<GetUserOutputDto> {
    try {
      const { blocking } = await this.subscribesService.checkBlockingState({
        requestUser: authUser,
        targetUser: userId,
      });
      if (blocking === BlockState.BLOCKING) {
        return {
          ok: true,
          blocking: BlockState.BLOCKING,
        };
      }
      if (blocking === BlockState.BLOCKED) {
        return {
          ok: true,
        };
      }
      const userInfo = await this.usersProfileRepository
        .createQueryBuilder('user')
        .where('id = :userId', { userId })
        .loadRelationCountAndMap('user.subscribings', 'user.subscribingUsers')
        .loadRelationCountAndMap('user.subscribers', 'user.subscribeUsers')
        .getOne();
      if (!userInfo) {
        return {
          ok: false,
          error: '사용자가 존재하지 않습니다.',
        };
      }
      return {
        ok: true,
        data: userInfo,
      };
    } catch (e) {
      return {
        ok: false,
        error: '사용자정보 조회에 실패했습니다.',
      };
    }
  }

  async editProfile(
    { userId }: UUID,
    editProfileInputDto: EditProfileInputDto,
  ): Promise<EditProfileOutputDto> {
    try {
      console.log(editProfileInputDto);
      const userInfo = await this.usersProfileRepository.findOne({
        id: userId,
      });
      console.log(userInfo);
      if (!userInfo) {
        return {
          ok: false,
          error: '사용자를 찾을 수 없습니다.',
        };
      }
      if (editProfileInputDto.photo) {
        if (userInfo.photo) {
          await this.uploadService.deleteFileAtS3(userInfo.photo);
        }
      }
      if (editProfileInputDto.password) {
        const authLocal = await this.authLoalRepository.findOne({
          user: userId,
        });
        if (!authLocal) {
          return {
            ok: false,
            error: '계정정보가 없습니다.',
          };
        }
        const hashedPassword = await bcrypt.hash(
          editProfileInputDto.password,
          10,
        );
        await this.authLoalRepository.update(authLocal.id, {
          password: hashedPassword,
        });
      }
      await this.usersProfileRepository.update(
        { id: userId },
        {
          ...userInfo,
          ...editProfileInputDto,
        },
      );

      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '프로필 정보 수정에 실패했습니다.',
      };
    }
  }

  async me({ userId }: UUID): Promise<CoreUserOutputDto> {
    try {
      const user = await this.usersProfileRepository
        .createQueryBuilder('user')
        .where('id = :userId', { userId })
        .loadRelationCountAndMap('user.subscribings', 'user.subscribingUsers')
        .loadRelationCountAndMap('user.subscribers', 'user.subscribeUsers')
        .getOne();
      // console.log(user);
      if (!user) {
        return {
          ok: false,
          error: '사용자가 존재하지 않습니다.',
        };
      }
      return {
        ok: true,
        data: user,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '사용자정보 조회에 실패했습니다.',
      };
    }
  }

  async findUsersByUsername({
    username,
  }: FindUserByUsernameInputDto): Promise<FindUserByUsernameOutputDto> {
    try {
      const users = await this.usersProfileRepository.find({
        username: ILike(`%${username}%`),
      });
      //console.log(users);
      return {
        ok: true,
        data: users,
      };
    } catch (e) {
      return {
        ok: false,
        error: '사용자 검색에 실패했습니다.',
      };
    }
  }
}
