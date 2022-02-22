import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { AuthUser, GqlAuthGuard } from 'src/auth/auth.guard';
import { args } from 'src/common/constants';
import { UserProfile } from 'src/users/entities/users-profile.entity';
import {
  CreatePostOutputDot,
  CreatePostInputDto,
} from './dtos/create-post-dto';
import {
  DeletePostInputDto,
  DeletePostOutputDto,
} from './dtos/delete-post.dto';
import { Posts } from './entities/posts.entity';
import { PostsService } from './posts.service';

@Resolver((of) => Posts)
export class PostsResolver {
  constructor(private postsService: PostsService) {}

  @Mutation((returns) => CreatePostOutputDot)
  @UseGuards(GqlAuthGuard)
  createPost(
    @AuthUser() user: UserProfile,
    @Args(args) args: CreatePostInputDto,
  ): Promise<CreatePostOutputDot> {
    return this.postsService.createPost(user, args);
  }

  @Mutation((returns) => DeletePostOutputDto)
  @UseGuards(GqlAuthGuard)
  deletePost(
    @AuthUser() user: UserProfile,
    @Args(args) args: DeletePostInputDto,
  ): Promise<DeletePostOutputDto> {
    return this.postsService.deletePost(user, args);
  }
}
