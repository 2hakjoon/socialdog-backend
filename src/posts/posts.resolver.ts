import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser, GqlAuthGuard } from 'src/auth/auth.guard';
import { args, page } from 'src/common/utils/constants';
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
import {
  GetMyPostsInputDto,
  GetMyPostsOutputDto,
} from './dtos/get-my-posts.dto';
import { GetSubscribingPostsOutputDto } from './dtos/get-subscribing-posts.dto';
import {
  GetUserPostsInputDto,
  GetUserPostsOutputDto,
} from './dtos/get-user-posts.dto';
import { Posts } from './entities/posts.entity';
import { PostsService } from './posts.service';
import { CorePagination } from '../common/dtos/core-pagination.dto';
import {
  GetPostsByAddressInputDto,
  getPostsByAddressOutputDto,
} from './dtos/get-posts-by-address.dto';
import { GetMyLikedPostsOutputDto } from './dtos/get-my-liked-posts.dto';
import { createCursor } from 'src/common/utils/createCusor';
import { CursorPaginationInputDto } from 'src/common/dtos/cursor-pagination';

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

  @Query((returns) => GetMyPostsOutputDto)
  @UseGuards(GqlAuthGuard)
  getMyPosts(
    @AuthUser() userId: UUID,
    @Args(args) args: GetMyPostsInputDto,
  ): Promise<GetMyPostsOutputDto> {
    return this.postsService.getMyPosts(userId, args);
  }

  @Query((returns) => GetUserPostsOutputDto)
  @UseGuards(GqlAuthGuard)
  getUserPosts(
    @AuthUser() authUserId: UUID,
    @Args(args) args: GetUserPostsInputDto,
    @Args(page) page: CorePagination,
  ): Promise<GetUserPostsOutputDto> {
    return this.postsService.getUserPosts(authUserId, args, page);
  }

  @Query((returns) => GetSubscribingPostsOutputDto)
  @UseGuards(GqlAuthGuard)
  getSubscribingPosts(
    @AuthUser() userId: UUID,
    @Args(page) page: CursorPaginationInputDto,
  ): Promise<GetSubscribingPostsOutputDto> {
    return this.postsService.getSubscribingPosts(userId, createCursor(page));
  }

  @Query((returns) => getPostsByAddressOutputDto)
  @UseGuards(GqlAuthGuard)
  getPostsByAddress(
    @AuthUser() userId: UUID,
    @Args(args) args: GetPostsByAddressInputDto,
    @Args(page) page: CorePagination,
  ): Promise<getPostsByAddressOutputDto> {
    return this.postsService.getPostsByAddress(userId, args, page);
  }

  @Query((returns) => GetMyLikedPostsOutputDto)
  @UseGuards(GqlAuthGuard)
  getMyLikedPosts(
    @AuthUser() userId: UUID,
    @Args(page) page: CorePagination,
  ): Promise<GetMyLikedPostsOutputDto> {
    return this.postsService.getMyLikedPosts(userId, page);
  }
}
