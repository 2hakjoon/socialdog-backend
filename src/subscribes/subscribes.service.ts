import { InjectRepository } from '@nestjs/typeorm';
import { UserProfile, UUID } from 'src/users/entities/users-profile.entity';
import { Repository } from 'typeorm';
import {
  ChangeBlockStateInputDto,
  ChangeBlockStateOutputDto,
} from './dtos/change-block-state.dto';
import { GetBlockingUsersOutputDto } from './dtos/get-blocking-users.dto';
import { GetMySubscribersOutputDto } from './dtos/get-my-subscribers.dto';
import { GetMySubscribingsOutputDto } from './dtos/get-my-subscribings.dto';
import { GetSubscribeRequestsOutputDto } from './dtos/get-subscribe-requests.dto';
import { GetSubscribingRequestsOutputDto } from './dtos/get-subscribing-requests.dto';
import {
  RequestSubscribeInputDto,
  RequestSubscribeOutputDto,
} from './dtos/request-subscribe.dto';
import {
  ResponseSubscribeInputDto,
  ResponseSubscribeOutputDto,
} from './dtos/response-subscribe.dto';
import {
  BlockState,
  SubscribeRequestState,
  Subscribes,
} from './entities/subscribes.entity';
import {
  CancelSubscribingInputDto,
  CancelSubscribingOutputDto,
} from './dtos/cancel-subscribe.dto';
import { GetMyRejectRequestsOutputDto } from './dtos/get-my-reject-requests.dto';

export class SubscribesService {
  constructor(
    @InjectRepository(UserProfile)
    private usersProfileRepository: Repository<UserProfile>,
    @InjectRepository(Subscribes)
    private subscribesRepository: Repository<Subscribes>,
  ) {}

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

      // console.log(subscribe);

      if (subscribe) {
        if (subscribe.subscribeRequest !== SubscribeRequestState.REQUESTED) {
          await this.subscribesRepository.update(subscribe.id, {
            ...subscribe,
            subscribeRequest: SubscribeRequestState.REQUESTED,
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
            subscribeRequest: SubscribeRequestState.REQUESTED,
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
    { from, subscribeRequest }: ResponseSubscribeInputDto,
  ): Promise<ResponseSubscribeOutputDto> {
    // console.log(from, subscribeRequest);
    try {
      if (userId === from) {
        return {
          ok: false,
          error: '본인에게 요청할 수 없습니다.',
        };
      }
      const subscribe = await this.subscribesRepository.findOne({
        from,
        to: userId,
      });
      console.log(subscribe);

      if (!subscribe?.subscribeRequest) {
        return {
          ok: false,
          error: '아직 요청을 수락 및 거절 할 수 없습니다.',
        };
      }

      await this.subscribesRepository.update(
        { id: subscribe.id },
        {
          ...subscribe,
          subscribeRequest,
        },
      );
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '요청 수락 및 거절을 실패했습니다.',
      };
    }
  }

  async cancelSubscribing(
    { userId: authUser }: UUID,
    { to }: CancelSubscribingInputDto,
  ): Promise<CancelSubscribingOutputDto> {
    try {
      if (authUser === to) {
        return {
          ok: false,
          error: '자신에게 요청할 수 없습니다.',
        };
      }
      const subscribes = await this.subscribesRepository.findOne({
        to,
        from: authUser,
      });

      if (!subscribes) {
        return {
          ok: false,
          error: '구독정보가 없습니다.',
        };
      }
      await this.subscribesRepository.update(
        { id: subscribes.id },
        { ...subscribes, subscribeRequest: SubscribeRequestState.NONE },
      );

      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '구독취소를 실패했습니다.',
      };
    }
  }

  async changeBlockState(
    { userId }: UUID,
    { block, username }: ChangeBlockStateInputDto,
  ): Promise<ChangeBlockStateOutputDto> {
    try {
      const userTo = await this.usersProfileRepository.findOne({ username });
      if (userId === userTo.id) {
        return {
          ok: false,
          error: '자신에게 요청할 수 없습니다.',
        };
      }

      if (!userTo) {
        return {
          ok: false,
          error: '차단 설정을 할 사용자가 존재하지 않습니다.',
        };
      }

      const subscribe = await this.subscribesRepository.findOne({
        to: userTo.id,
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
            to: userTo.id,
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

  async checkBlockingAndRequestState({
    requestUser,
    targetUser,
  }: {
    requestUser: string;
    targetUser: string;
  }) {
    try {
      const subscribes = await this.subscribesRepository
        .createQueryBuilder('subs')
        .where('subs.to = :targetUser AND subs.from = :requestUser', {
          targetUser,
          requestUser,
        })
        .orWhere('subs.to = :requestUser AND subs.from = :targetUser', {
          targetUser,
          requestUser,
        })
        .loadAllRelationIds({ relations: ['to', 'from'] })
        .getMany();
      const blocking = subscribes.filter((subs) => {
        if (subs.to === targetUser && subs.block) {
          return true;
        }
      });
      const blocked = subscribes.filter((subs) => {
        if (subs.from === targetUser && subs.block) {
          return true;
        }
      });

      const requestState = subscribes.filter((subs) => {
        if (subs.to === targetUser) {
          return true;
        }
      })[0];
      const checkSubscribeRequested =
        requestState?.subscribeRequest === SubscribeRequestState.REJECTED
          ? SubscribeRequestState.REQUESTED
          : requestState?.subscribeRequest || SubscribeRequestState.NONE;

      // console.log(checkSubscribeRequested);
      if (blocking.length) {
        return {
          blocking: BlockState.BLOCKING,
          subscribeRequest: checkSubscribeRequested,
        };
      }
      if (blocked.length) {
        return {
          blocking: BlockState.BLOCKED,
          subscribeRequest: checkSubscribeRequested,
        };
      }
      return {
        blocking: BlockState.NONE,
        subscribeRequest: checkSubscribeRequested,
      };
    } catch (e) {
      throw new Error('차단 상태 확인 오류');
    }
  }

  async getMySubscribings({
    userId,
  }: UUID): Promise<GetMySubscribingsOutputDto> {
    try {
      const subscribings = await this.subscribesRepository.find({
        where: {
          from: userId,
          subscribeRequest: SubscribeRequestState.CONFIRMED,
          block: false,
        },
        select: ['id', 'to'],
        loadRelationIds: { relations: ['to'] },
      });
      // console.log(subscribings);

      const subscribingUserIds = subscribings.map(
        (subscribing) => subscribing.to,
      );

      if (!subscribingUserIds.length) {
        return {
          ok: true,
          data: [],
        };
      }

      const subscribingUsers = await this.usersProfileRepository
        .createQueryBuilder('users')
        .where('users.Id IN (:...userIds)', { userIds: subscribingUserIds })
        .getMany();
      return {
        ok: true,
        data: subscribingUsers,
      };
    } catch (e) {
      return {
        ok: false,
        error: '구독중인 계정 정보를 불러오는데 실패했습니다.',
      };
    }
  }

  async getMySubscribers({ userId }: UUID): Promise<GetMySubscribersOutputDto> {
    try {
      const subscribers = await this.subscribesRepository.find({
        where: {
          to: userId,
          subscribeRequest: SubscribeRequestState.CONFIRMED,
          block: false,
        },
        select: ['id', 'from'],
        loadRelationIds: { relations: ['from'] },
      });
      // console.log(subscribings);

      const subscriberIds = subscribers.map((subscriber) => subscriber.from);

      if (!subscriberIds.length) {
        return {
          ok: true,
          data: [],
        };
      }
      const subscribingUsers = await this.usersProfileRepository
        .createQueryBuilder('users')
        .where('users.Id IN (:...userIds)', { userIds: subscriberIds })
        .getMany();
      return {
        ok: true,
        data: subscribingUsers,
      };
    } catch (e) {
      return {
        ok: false,
        error: '구독자 정보를 불러오는데 실패했습니다.',
      };
    }
  }

  async getBlokingUsers({ userId }: UUID): Promise<GetBlockingUsersOutputDto> {
    try {
      const blockings = await this.subscribesRepository.find({
        where: {
          from: userId,
          block: true,
        },
        select: ['id', 'to'],
        loadRelationIds: { relations: ['to'] },
      });
      // console.log(subscribings);

      const blockingUserIds = blockings.map((blockingUser) => blockingUser.to);

      if (!blockingUserIds.length) {
        return {
          ok: true,
          data: [],
        };
      }
      const blockingUsers = await this.usersProfileRepository
        .createQueryBuilder('users')
        .where('users.Id IN (:...userIds)', { userIds: blockingUserIds })
        .getMany();

      return {
        ok: true,
        data: blockingUsers,
      };
    } catch (e) {
      return {
        ok: false,
        error: '차단한 사용자를 불러오는데 실패했습니다.',
      };
    }
  }

  async getMyRejectRequests({
    userId,
  }: UUID): Promise<GetMyRejectRequestsOutputDto> {
    try {
      const rejectedSubscribes = await this.subscribesRepository.find({
        where: {
          to: userId,
          subscribeRequest: SubscribeRequestState.REJECTED,
        },
        select: ['id', 'from'],
        loadRelationIds: { relations: ['from'] },
      });
      //console.log(rejectedSubscribes);

      const rejectedUserIds = rejectedSubscribes.map(
        (rejectedUser) => rejectedUser.from,
      );

      if (!rejectedUserIds.length) {
        return {
          ok: true,
          data: [],
        };
      }
      const rejectedUsers = await this.usersProfileRepository
        .createQueryBuilder('users')
        .where('users.Id IN (:...userIds)', { userIds: rejectedUserIds })
        .getMany();

      return {
        ok: true,
        data: rejectedUsers,
      };
    } catch (e) {
      return {
        ok: false,
        error: '구독 거절한 사용자를 불러오는데 실패했습니다.',
      };
    }
  }

  async getSubscribingRequests({
    userId,
  }: UUID): Promise<GetSubscribingRequestsOutputDto> {
    try {
      const subscribingRequests = await this.subscribesRepository.find({
        where: [
          {
            from: userId,
            subscribeRequest: SubscribeRequestState.REJECTED,
          },
          {
            from: userId,
            subscribeRequest: SubscribeRequestState.REQUESTED,
          },
        ],
        select: ['id', 'to'],
        loadRelationIds: { relations: ['to'] },
      });

      const subscribingRequestsUserIds = subscribingRequests.map(
        (subscribingRequest) => subscribingRequest.to,
      );

      if (!subscribingRequestsUserIds.length) {
        return {
          ok: true,
          data: [],
        };
      }
      const subscribingRequestsUsers = await this.usersProfileRepository
        .createQueryBuilder('users')
        .where('users.Id IN (:...userIds)', {
          userIds: subscribingRequestsUserIds,
        })
        .getMany();

      return {
        ok: true,
        data: subscribingRequestsUsers,
      };
    } catch (e) {
      return {
        ok: false,
        error: '구독 신청한 사용자 목록을 불러오는데 실패했습니다.',
      };
    }
  }

  async getSubscribeRequests({
    userId,
  }: UUID): Promise<GetSubscribeRequestsOutputDto> {
    try {
      const subscribeRequests = await this.subscribesRepository.find({
        where: {
          to: userId,
          subscribeRequest: SubscribeRequestState.REQUESTED,
        },
        select: ['id', 'from'],
        loadRelationIds: { relations: ['from'] },
      });

      const subscribeRequestsUserIds = subscribeRequests.map(
        (subscribeRequest) => subscribeRequest.from,
      );

      if (!subscribeRequestsUserIds.length) {
        return {
          ok: true,
          data: [],
        };
      }
      const subscribeRequestsUsers = await this.usersProfileRepository
        .createQueryBuilder('users')
        .where('users.Id IN (:...userIds)', {
          userIds: subscribeRequestsUserIds,
        })
        .getMany();

      return {
        ok: true,
        data: subscribeRequestsUsers,
      };
    } catch (e) {
      return {
        ok: false,
        error: '구독 신청한 사용자 목록을 불러오는데 실패했습니다.',
      };
    }
  }
}
