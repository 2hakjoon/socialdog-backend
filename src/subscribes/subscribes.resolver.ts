import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser, GqlAuthGuard } from 'src/auth/auth.guard';
import { UUID } from 'src/users/entities/users-profile.entity';
import {
  ChangeBlockStateInputDto,
  ChangeBlockStateOutputDto,
} from './dtos/change-block-state.dto';
import {
  RequestSubscribeInputDto,
  RequestSubscribeOutputDto,
} from './dtos/request-subscribe.dto';
import {
  ResponseSubscribeInputDto,
  ResponseSubscribeOutputDto,
} from './dtos/response-subscribe.dto';
import { Subscribes } from './entities/subscribes.entity';
import { SubscribesService } from './subscribes.service';
import { args } from '../common/constants';
import { GetMySubscribingsOutputDto } from './dtos/get-my-subscribings.dto';
import { GetMySubscribersOutputDto } from './dtos/get-my-subscribers.dto';
import { GetBlockingUsersOutputDto } from './dtos/get-blocking-users.dto';
import { GetSubscribeRequestsOutputDto } from './dtos/get-subscribe-requests.dto';
import { GetSubscribingRequestsOutputDto } from './dtos/get-subscribing-requests.dto';
import {
  CancelSubscribeInputDto,
  CancelSubscribeOutputDto,
} from './dtos/cancel-subscribe.dto';

@Resolver((of) => Subscribes)
export class SubscribesResolver {
  constructor(private subscribeService: SubscribesService) {}

  @Mutation(() => RequestSubscribeOutputDto)
  @UseGuards(GqlAuthGuard)
  requestSubscribe(
    @AuthUser() userId: UUID,
    @Args(args) args: RequestSubscribeInputDto,
  ): Promise<RequestSubscribeOutputDto> {
    return this.subscribeService.requestSubscribe(userId, args);
  }

  @Mutation(() => ResponseSubscribeOutputDto)
  @UseGuards(GqlAuthGuard)
  responseSubscribe(
    @AuthUser() userId: UUID,
    @Args(args) args: ResponseSubscribeInputDto,
  ): Promise<ResponseSubscribeOutputDto> {
    return this.subscribeService.responseSubscribe(userId, args);
  }

  @Mutation(() => CancelSubscribeOutputDto)
  @UseGuards(GqlAuthGuard)
  cancelSubscribe(
    @AuthUser() userId: UUID,
    @Args(args) args: CancelSubscribeInputDto,
  ): Promise<CancelSubscribeOutputDto> {
    return this.subscribeService.cancleSubscribe(userId, args);
  }

  @Mutation(() => ChangeBlockStateOutputDto)
  @UseGuards(GqlAuthGuard)
  changeBlockState(
    @AuthUser() userId: UUID,
    @Args(args) args: ChangeBlockStateInputDto,
  ): Promise<ChangeBlockStateOutputDto> {
    return this.subscribeService.changeBlockState(userId, args);
  }

  @Query(() => GetMySubscribingsOutputDto)
  @UseGuards(GqlAuthGuard)
  getMySubscribings(
    @AuthUser() userId: UUID,
  ): Promise<GetMySubscribingsOutputDto> {
    return this.subscribeService.getMySubscribings(userId);
  }

  @Query(() => GetMySubscribersOutputDto)
  @UseGuards(GqlAuthGuard)
  getMySubscribers(
    @AuthUser() userId: UUID,
  ): Promise<GetMySubscribersOutputDto> {
    return this.subscribeService.getMySubscribers(userId);
  }

  @Query(() => GetBlockingUsersOutputDto)
  @UseGuards(GqlAuthGuard)
  getMyBlockingUsers(
    @AuthUser() userId: UUID,
  ): Promise<GetBlockingUsersOutputDto> {
    return this.subscribeService.getBlokingUsers(userId);
  }

  @Query(() => GetSubscribingRequestsOutputDto)
  @UseGuards(GqlAuthGuard)
  getSubscribingRequests(
    @AuthUser() userId: UUID,
  ): Promise<GetSubscribingRequestsOutputDto> {
    return this.subscribeService.getSubscribingRequests(userId);
  }

  @Query(() => GetSubscribeRequestsOutputDto)
  @UseGuards(GqlAuthGuard)
  getSubscribeRequests(
    @AuthUser() userId: UUID,
  ): Promise<GetSubscribeRequestsOutputDto> {
    return this.subscribeService.getSubscribeRequests(userId);
  }
}
