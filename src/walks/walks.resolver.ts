import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser, GqlAuthGuard } from 'src/auth/auth.guard';
import { args } from 'src/common/constants';
import {
  CoreOutputDto,
  CoreWalksOutputDto,
} from 'src/common/dtos/core-output.dto';
import { UUID } from 'src/users/entities/users-profile.entity';
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
    @AuthUser() userId: UUID,
    @Args(args) args: CreateWalkInputDto,
  ): Promise<CreateWalkOutputDto> {
    return this.walksService.createWalk(userId, args);
  }

  @Query(() => GetWalkOutputDto)
  @UseGuards(GqlAuthGuard)
  getWalk(
    @AuthUser() userId: UUID,
    @Args(args) args: GetWalkInputDto,
  ): Promise<GetWalkOutputDto> {
    return this.walksService.getWalk(userId, args);
  }

  @Query(() => CoreWalksOutputDto)
  @UseGuards(GqlAuthGuard)
  getWalks(@AuthUser() userId: UUID): Promise<CoreWalksOutputDto> {
    return this.walksService.getWalks(userId);
  }

  @Mutation(() => CoreOutputDto)
  @UseGuards(GqlAuthGuard)
  deleteWalk(@AuthUser() userId: UUID, @Args(args) args: DeleteWalkInputDto) {
    return this.walksService.deleteWalks(userId, args);
  }
}
