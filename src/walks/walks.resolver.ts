import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser, GqlAuthGuard } from 'src/auth/auth.guard';
import { args } from 'src/common/constants';
import { CoreWalksOutputDto } from 'src/common/dtos/core-output.dto';
import { User } from 'src/users/entities/users.entity';
import {
  CreateWalkInputDto,
  CreateWalkOutputDto,
} from './dtos/create-walk.dto';
import { Walks } from './entities/walks.entity';
import { WalksService } from './walks.service';

@Resolver((of) => Walks)
export class WalksResolver {
  constructor(private walksService: WalksService) {}

  @Mutation((returns) => CreateWalkOutputDto)
  @UseGuards(GqlAuthGuard)
  createWalk(
    @AuthUser() user: User,
    @Args(args) args: CreateWalkInputDto,
  ): Promise<CreateWalkOutputDto> {
    return this.walksService.createWalk(user, args);
  }

  @Query(() => CoreWalksOutputDto)
  @UseGuards(GqlAuthGuard)
  getWalks(@AuthUser() user: User): Promise<CoreWalksOutputDto> {
    return this.walksService.getWalks(user);
  }
}
