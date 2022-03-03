import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
import {
  RequestSubscribeInputDto,
  RequestSubscribeOutputDto,
} from './dtos/request-subscribe.dto';
import {
  Subscribes,
  RequestStatus,
  BlockState,
} from './entities/subscribes.entity';
import {
  ResponseSubscribeInputDto,
  ResponseSubscribeOutputDto,
} from './dtos/response-subscribe.dto';
import {
  ChangeBlockStateInputDto,
  ChangeBlockStateOutputDto,
} from './dtos/change-block-state.dto';

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

      const user = await this.usersProfileRepository.save(
        await this.usersProfileRepository.create({
          loginStrategy: LoginStrategy.LOCAL,
        }),
      );
      console.log(user);

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
      const blockstate = await this.subscribesRepository
        .createQueryBuilder('subs')
        .where('subs.to = :userId AND subs.from = :authUser', {
          userId,
          authUser,
        })
        .orWhere('subs.to = :authUser AND subs.from = :userId', {
          userId,
          authUser,
        })
        .loadAllRelationIds({ relations: ['to', 'from'] })
        .getMany();
      const blocking = blockstate.filter((subs) => {
        if (subs.to === userId && subs.block) {
          return true;
        }
      });
      const blocked = blockstate.filter((subs) => {
        if (subs.from === userId && subs.block) {
          return true;
        }
      });
      console.log(blocking, blocked);
      if (blocking.length) {
        return {
          ok: true,
          blocking: BlockState.BLOCKING,
        };
      }
      if (blocked.length) {
        return {
          ok: true,
        };
      }
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
    { userId }: UUID,
    editProfileInputDto: EditProfileInputDto,
  ): Promise<EditProfileOutputDto> {
    try {
      const userInfo = await this.usersProfileRepository.findOne({
        id: userId,
      });
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
      const user = await this.usersProfileRepository.findOne(
        { id: userId },
        { relations: ['subscribingUsers', 'subscribeUsers'] },
      );
      if (!user) {
        return {
          ok: false,
          error: '유저가 존재하지 않습니다.',
        };
      }
      return {
        ok: true,
        data: user,
      };
    } catch (e) {
      return {
        ok: false,
        error: '유저정보 조회에 실패했습니다.',
      };
    }
  }

  async getUserProfile({ userId }: UUID): Promise<CoreUserOutputDto> {
    try {
      const user = await this.usersProfileRepository.findOne(
        { id: userId },
        { relations: ['subscribingUsers', 'subscribeUsers'] },
      );
      if (!user) {
        return {
          ok: false,
          error: '유저가 존재하지 않습니다.',
        };
      }
      return {
        ok: true,
        data: user,
      };
    } catch (e) {
      return {
        ok: false,
        error: '유저정보 조회에 실패했습니다.',
      };
    }
  }
  async requestSubscribe(
    { userId }: UUID,
    { to }: RequestSubscribeInputDto,
  ): Promise<RequestSubscribeOutputDto> {
    try {
      if (userId === to) {
        return {
          ok: false,
          error: '자신에게 요청할 수 없습니다.',
        };
      }
      const subscribe = await this.subscribesRepository.findOne({
        to,
        from: userId,
      });

      if (subscribe) {
        if (!subscribe.subscribeRequest) {
          await this.subscribesRepository.update(subscribe.id, {
            ...subscribe,
            subscribeRequest: RequestStatus.REQUESTED,
          });
        }
      } else {
        const userTo = await this.usersProfileRepository.findOne({ id: to });
        if (!userTo) {
          return {
            ok: false,
            error: '요청할 사용자가 존재하지 않습니다.',
          };
        }
        await this.subscribesRepository.save(
          await this.subscribesRepository.create({
            to,
            from: userId,
            subscribeRequest: RequestStatus.REQUESTED,
          }),
        );
      }
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
    { userId }: UUID,
    { id, subscribeRequest }: ResponseSubscribeInputDto,
  ): Promise<ResponseSubscribeOutputDto> {
    try {
      const subscribe = await this.subscribesRepository.findOne(
        { id },
        { loadRelationIds: { relations: ['to', 'from'] } },
      );
      if (subscribe.to !== userId) {
        return {
          ok: false,
          error: '다른 사람에게 온 요청은 수락할 수 없습니다.',
        };
      }

      if (!subscribe.subscribeRequest) {
        return {
          ok: false,
          error: '아직 요청을 수락 및 거절 할 수 없습니다.',
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

  async changeBlockState(
    { userId }: UUID,
    { to, block }: ChangeBlockStateInputDto,
  ): Promise<ChangeBlockStateOutputDto> {
    try {
      const userTo = await this.usersProfileRepository.findOne({ id: to });

      if (!userTo) {
        return {
          ok: false,
          error: '차단 설정을 할 사용자가 존재하지 않습니다.',
        };
      }

      const subscribe = await this.subscribesRepository.findOne({
        to,
        from: userId,
      });

      if (subscribe) {
        await this.subscribesRepository.update(subscribe.id, {
          ...subscribe,
          block,
        });
      } else {
        await this.subscribesRepository.save(
          await this.subscribesRepository.create({
            from: userId,
            to,
            block,
          }),
        );
      }

      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '차단 설정 중 에러가 발생하였습니다.',
      };
    }
  }
}
