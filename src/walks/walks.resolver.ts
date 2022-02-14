import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser, GqlAuthGuard } from 'src/auth/auth.guard';
import { args } from 'src/common/constants';
import {
  CoreOutputDto,
  CoreWalksOutputDto,
} from 'src/common/dtos/core-output.dto';
import { UserProfile } from 'src/users/entities/users-profile.entity';
import {
  CreateWalkInputDto,
  CreateWalkOutputDto,
} from './dtos/create-walk.dto';
import { DeleteWalkInputDto } from './dtos/delete-walk.dto';
import { GetWalkInputDto, GetWalkOutputDto } from './dtos/get-walk.dto';
import { Walks } from './entities/walks.entity';
import { WalksService } from './walks.service';

@Resolver((of) => Walks)
export class WalksResolver {
  constructor(private walksService: WalksService) {}

  @Mutation((returns) => CreateWalkOutputDto)
  @UseGuards(GqlAuthGuard)
  createWalk(
    @AuthUser() user: UserProfile,
    @Args(args) args: CreateWalkInputDto,
  ): Promise<CreateWalkOutputDto> {
    return this.walksService.createWalk(user, args);
  }

  @Query(() => GetWalkOutputDto)
  @UseGuards(GqlAuthGuard)
  getWalk(
    @AuthUser() user: UserProfile,
    @Args(args) args: GetWalkInputDto,
  ): Promise<GetWalkOutputDto> {
    return this.walksService.getWalk(user, args);
  }

  @Query(() => CoreWalksOutputDto)
  @UseGuards(GqlAuthGuard)
  getWalks(@AuthUser() user: UserProfile): Promise<CoreWalksOutputDto> {
    return this.walksService.getWalks(user);
  }

  @Mutation(() => CoreOutputDto)
  @UseGuards(GqlAuthGuard)
  deleteWalk(
    @AuthUser() user: UserProfile,
    @Args(args) args: DeleteWalkInputDto,
  ) {
    return this.walksService.deleteWalks(user, args);
  }
}
