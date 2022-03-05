import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUser, GqlAuthGuard } from 'src/auth/auth.guard';
import {
  ToggleLikePostInputDto,
  ToggleLikePostOutputDto,
} from 'src/likes/dtos/toggle-like-post.dto';
import { Likes } from './entities/likes.entity';
import { args } from '../common/constants';
import { UUID } from 'src/users/entities/users-profile.entity';
import { LikesService } from './likes.service';

@Resolver(() => Likes)
export class LikesResolver {
  constructor(private likesService: LikesService) {}

  @Mutation(() => ToggleLikePostOutputDto)
  @UseGuards(GqlAuthGuard)
  toggleLikePost(
    @AuthUser() userId: UUID,
    @Args(args) args: ToggleLikePostInputDto,
  ) {
    return this.likesService.toggleLikePost(userId, args);
  }
}
