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
import {
  BlockState,
  SubscribeRequestState,
  Subscribes,
} from 'src/subscribes/entities/subscribes.entity';
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
    @InjectRepository(Subscribes)
    private subscribesRepository: Repository<Subscribes>,
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

  async getUserProfile(
    { userId: authUser }: UUID,
    { username }: GetUserInputDto,
  ): Promise<GetUserOutputDto> {
    try {
      const { id: userId } = await this.usersProfileRepository.findOne({
        username,
      });

      if (!userId) {
        return {
          ok: false,
          error: '사용자가 존재하지 않습니다.',
        };
      }

      if (authUser === userId) {
        return this.getMyProfile({ userId });
      }

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
        .loadRelationCountAndMap(
          'user.subscribings',
          'user.subscribingUsers',
          'subscribings',
          (qb) =>
            qb.where(
              'subscribings.subscribeRequest = :subscribe AND subscribings.block = :block',
              {
                subscribe: SubscribeRequestState.CONFIRMED,
                block: false,
              },
            ),
        )
        .loadRelationCountAndMap(
          'user.subscribers',
          'user.subscribeUsers',
          'subscribers',
          (qb) =>
            qb.where('subscribers.subscribeRequest = :value', {
              value: SubscribeRequestState.CONFIRMED,
            }),
        )
        .getOne();

      if (userInfo.profileOpen) {
        return {
          ok: true,
          data: userInfo,
        };
      }

      const { subscribeRequest } = await this.subscribesRepository.findOne({
        where: {
          from: authUser,
          to: userId,
        },
      });

      // 구독하기 버튼 활성화 상태를 위해 필요.
      // 거절당한경우를 가리기 위해서 REJECTED는 REQUESTED로 변환.
      const checkSubscribeRequested =
        subscribeRequest === SubscribeRequestState.REJECTED
          ? SubscribeRequestState.REQUESTED
          : subscribeRequest;

      if (subscribeRequest !== SubscribeRequestState.CONFIRMED) {
        return {
          ok: true,
          data: userInfo,
          profileOpened: false,
          subscribeRequested: checkSubscribeRequested,
        };
      }

      return {
        ok: true,
        data: userInfo,
        subscribeRequested: checkSubscribeRequested,
      };
    } catch (e) {
      return {
        ok: false,
        error: '사용자정보 조회에 실패했습니다.',
      };
    }
  }

  async getMyProfile({ userId }: UUID): Promise<CoreUserOutputDto> {
    try {
      const user = await this.usersProfileRepository
        .createQueryBuilder('user')
        .where('id = :userId', { userId })
        .loadRelationCountAndMap(
          'user.subscribings',
          'user.subscribingUsers',
          'subscribings',
          (qb) =>
            qb.where(
              'subscribings.subscribeRequest = :subscribe AND subscribings.block = :block',
              {
                subscribe: SubscribeRequestState.CONFIRMED,
                block: false,
              },
            ),
        )
        .loadRelationCountAndMap(
          'user.subscribers',
          'user.subscribeUsers',
          'subscribers',
          (qb) =>
            qb.where('subscribers.subscribeRequest = :value', {
              value: SubscribeRequestState.CONFIRMED,
            }),
        )
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

  async me({ userId }: UUID): Promise<CoreUserOutputDto> {
    try {
      const user = await this.usersProfileRepository
        .createQueryBuilder('user')
        .where('id = :userId', { userId })
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
