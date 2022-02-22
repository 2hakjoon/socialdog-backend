import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { AuthUser, GqlAuthGuard } from 'src/auth/auth.guard';
import { args } from 'src/common/constants';
import { UserProfile } from 'src/users/entities/users-profile.entity';
import {
  CreatePostOutputDot,
  CreatePostsInputDto,
} from './dtos/create-posts-dto';
import { Posts } from './entities/posts.entity';
import { PostsService } from './posts.service';

@Resolver((of) => Posts)
export class PostsResolver {
  constructor(private postsService: PostsService) {}

  @Mutation((returns) => CreatePostOutputDot)
  @UseGuards(GqlAuthGuard)
  createPost(
    @AuthUser() user: UserProfile,
    @Args(args) args: CreatePostsInputDto,
  ): Promise<CreatePostOutputDot> {
    return this.postsService.createPost(user, args);
  }
}
