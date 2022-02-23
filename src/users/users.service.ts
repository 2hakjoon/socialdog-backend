import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateAccountInputDto,
  CreateAccountOutputDto,
} from './dtos/craete-account.dto';
import { LoginStrategy, UserProfile } from './entities/users-profile.entity';
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
import {
  RequestSubscribeInputDto,
  RequestSubscribeOutputDto,
} from './dtos/request-subscribe.dto';
import { Subscribes, SubscribeStatus } from './entities/subscribes.entity';
import {
  ResponseSubscribeInputDto,
  ResponseSubscribeOutputDto,
} from './dtos/response-subscribe.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserProfile)
    private usersProfileRepository: Repository<UserProfile>,
    @InjectRepository(AuthLocal)
    private authLoalRepository: Repository<AuthLocal>,
    @InjectRepository(Subscribes)
    private subscribesRepository: Repository<Subscribes>,
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

      const { id: user } = await this.usersProfileRepository.save(
        await this.usersProfileRepository.create({
          loginStrategy: LoginStrategy.LOCAL,
        }),
      );
      console.log(user);

      await this.authLoalRepository.save(
        await this.authLoalRepository.create({
          email,
          password: hashedPassword,
          user,
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

  async getProfile({ userId }: GetUserInputDto): Promise<GetUserOutputDto> {
    console.log(userId);
    try {
      const userInfo = await this.usersProfileRepository.findOne({
        id: userId,
      });
      if (!userInfo) {
        return {
          ok: false,
          error: '유저가 존재하지 않습니다.',
        };
      }
      return {
        ok: true,
        data: userInfo,
      };
    } catch (e) {
      return {
        ok: false,
        error: '유저정보 조회에 실패했습니다.',
      };
    }
  }

  async editProfile(
    user: UserProfile,
    editProfileInputDto: EditProfileInputDto,
  ): Promise<EditProfileOutputDto> {
    try {
      const userInfo = await this.usersProfileRepository.findOne({
        id: user.id,
      });
      if (!userInfo) {
        return {
          ok: false,
          error: '사용자를 찾을 수 없습니다.',
        };
      }
      if (editProfileInputDto.photo) {
        if (user.photo) {
          await this.uploadService.deleteFileAtS3(user.photo);
        }
      }
      if (editProfileInputDto.password) {
        const authLocal = await this.authLoalRepository.findOne({
          user: user.id,
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
      await this.usersProfileRepository.update(user.id, {
        ...user,
        ...editProfileInputDto,
      });

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

  async me(user: UserProfile): Promise<CoreUserOutputDto> {
    return {
      ok: true,
      data: user,
    };
  }

  async requestSubscribe(
    user: UserProfile,
    { to }: RequestSubscribeInputDto,
  ): Promise<RequestSubscribeOutputDto> {
    try {
      if (user.id === to) {
        return {
          ok: false,
          error: '자신에게 요청할 수 없습니다.',
        };
      }
      await this.subscribesRepository.save(
        await this.subscribesRepository.create({
          to,
          from: user.id,
          subscribeRequest: SubscribeStatus.REQUESTED,
        }),
      );
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: true,
        error: '요청을 실패하였습니다.',
      };
    }
  }

  async responseSubscribe(
    user: UserProfile,
    { id, subscribeRequest }: ResponseSubscribeInputDto,
  ): Promise<ResponseSubscribeOutputDto> {
    try {
      const subscribe = await this.subscribesRepository.findOne(
        { id },
        { loadRelationIds: { relations: ['to', 'from'] } },
      );
      console.log(subscribe, user.id);
      if (subscribe.to !== user.id) {
        return {
          ok: false,
          error: '다른 사람에게 온 요청은 수락할 수 없습니다.',
        };
      }
      await this.subscribesRepository.update(id, {
        ...subscribe,
        subscribeRequest,
      });
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '요청 수락 및 거절을 실패했습니다.',
      };
    }
  }
}
