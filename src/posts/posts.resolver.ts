import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUser, GqlAuthGuard } from 'src/auth/auth.guard';
import { args } from 'src/common/constants';
import { UUID } from 'src/users/entities/users-profile.entity';
import {
  CreatePostOutputDto,
  CreatePostInputDto,
} from './dtos/create-post-dto';
import {
  DeletePostInputDto,
  DeletePostOutputDto,
} from './dtos/delete-post.dto';
import { EditPostInputDto, EditPostOutputDto } from './dtos/edit-post-dto';
import { Posts } from './entities/posts.entity';
import { PostsService } from './posts.service';

@Resolver((of) => Posts)
export class PostsResolver {
  constructor(private postsService: PostsService) {}

  @Mutation((returns) => CreatePostOutputDto)
  @UseGuards(GqlAuthGuard)
  createPost(
    @AuthUser() userId: UUID,
    @Args(args) args: CreatePostInputDto,
  ): Promise<CreatePostOutputDto> {
    return this.postsService.createPost(userId, args);
  }

  @Mutation((returns) => DeletePostOutputDto)
  @UseGuards(GqlAuthGuard)
  deletePost(
    @AuthUser() userId: UUID,
    @Args(args) args: DeletePostInputDto,
  ): Promise<DeletePostOutputDto> {
    return this.postsService.deletePost(userId, args);
  }

  @Mutation((returns) => EditPostOutputDto)
  @UseGuards(GqlAuthGuard)
  editPost(
    @AuthUser() userId: UUID,
    @Args(args) args: EditPostInputDto,
  ): Promise<EditPostOutputDto> {
    return this.postsService.editPost(userId, args);
  }
}
