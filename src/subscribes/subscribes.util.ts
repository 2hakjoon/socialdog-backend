import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BlockState,
  SubscribeRequestState,
  Subscribes,
} from './entities/subscribes.entity';

export class SubscribesUtil {
  constructor(
    @InjectRepository(Subscribes)
    private subscribesRepository: Repository<Subscribes>,
  ) {}

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
      // console.log(requestState);
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
      console.log(e);
      throw new Error('차단 상태 확인 오류');
    }
  }

  async checkIsBlockRelation(userOne, userTwo): Promise<boolean> {
    return Boolean(
      await this.subscribesRepository.findOne({
        where: [
          { from: userOne, to: userTwo, block: true },
          { to: userOne, from: userTwo, block: true },
        ],
      }),
    );
  }

  returnBlockAndSubscribeMessage(
    blocking: BlockState,
    subscribeRequest: SubscribeRequestState,
  ) {
    if (blocking === BlockState.BLOCKED) {
      return {
        ok: false,
        error: '게시글을 확인 할 수 없습니다.',
      };
    }

    if (blocking === BlockState.BLOCKING) {
      return {
        ok: false,
        error: '차단한 유저입니다.',
      };
    }

    if (subscribeRequest !== SubscribeRequestState.CONFIRMED) {
      return {
        ok: false,
        error: '아직 구독중이 아닙니다.',
      };
    }
  }
}
