import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser, GqlAuthGuard } from 'src/auth/auth.guard';
import { CursorPaginationInputDto } from 'src/common/dtos/cursor-pagination';
import { args, page } from 'src/common/utils/constants';
import { UUID } from 'src/users/entities/users-profile.entity';
import { CommentsService } from './comments.service';
import { createCursor } from '../common/utils/paginationUtils';
import {
  CreateCommentInputDto,
  CreateCommentOutputDto,
} from './dtos/create-comment.dto';
import {
  CreateReCommentInputDto,
  CreateReCommentOutputDto,
} from './dtos/create-recomment.dto';
import {
  DeleteCommentInputDto,
  DeleteCommentOutputDto,
} from './dtos/delete-comment.dto';
import {
  DeleteReCommentInputDto,
  DeleteReCommentOutputDto,
} from './dtos/delete-recomment.dto';
import {
  GetReCommentsInputDto,
  GetReCommentsOutputDto,
} from './dtos/get-recomments.dto';
import {
  GetCommentInputDto,
  GetCommentOutputDto,
} from './dtos/get-comment.dto';

@Resolver()
export class CommentsResolver {
  constructor(private commentsService: CommentsService) {}

  // 댓글생성
  @Mutation(() => CreateCommentOutputDto)
  @UseGuards(GqlAuthGuard)
  createComment(
    @AuthUser() user: UUID,
    @Args(args) args: CreateCommentInputDto,
  ): Promise<CreateCommentOutputDto> {
    return this.commentsService.createComment(user, args);
  }

  // 대댓글 생성
  @Mutation(() => CreateReCommentOutputDto)
  @UseGuards(GqlAuthGuard)
  createReComment(
    @AuthUser() user: UUID,
    @Args(args) args: CreateReCommentInputDto,
  ): Promise<CreateReCommentOutputDto> {
    return this.commentsService.createReComment(user, args);
  }

  // 댓글 보기
  @Query(() => GetCommentOutputDto)
  @UseGuards(GqlAuthGuard)
  getComment(
    @Args(args) args: GetCommentInputDto,
  ): Promise<GetCommentOutputDto> {
    return this.commentsService.getComment(args);
  }

  // 대댓글들 보기
  @Query(() => GetReCommentsOutputDto)
  @UseGuards(GqlAuthGuard)
  getReComments(
    @Args(args) args: GetReCommentsInputDto,
    @Args(page) page: CursorPaginationInputDto,
  ): Promise<GetReCommentsOutputDto> {
    return this.commentsService.getReComments(args, createCursor(page));
  }

  // 댓글 삭제
  @Mutation(() => DeleteCommentOutputDto)
  @UseGuards(GqlAuthGuard)
  deleteComment(
    @AuthUser() user: UUID,
    @Args(args) args: DeleteCommentInputDto,
  ): Promise<DeleteCommentOutputDto> {
    return this.deleteComment(user, args);
  }

  // 대댓글 삭제
  @Mutation(() => DeleteReCommentOutputDto)
  @UseGuards(GqlAuthGuard)
  deleteReComment(
    @AuthUser() user: UUID,
    @Args(args) args: DeleteReCommentInputDto,
  ): Promise<DeleteReCommentOutputDto> {
    return this.deleteReComment(user, args);
  }
}
