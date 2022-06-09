import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser, GqlAuthGuard } from 'src/auth/auth.guard';
import { args } from 'src/common/utils/constants';
import { UUID } from 'src/users/entities/users-profile.entity';
import {
  CreateReportBugInputDto,
  CreateReportBugOutputDto,
  GetReportBugsOutputDto,
} from './dtos/report-bug.dto';
import {
  CreateReportCommentInputDto,
  CreateReportCommentOutputDto,
  GetReportCommentsOutputDto,
} from './dtos/report-comment.dto';
import {
  CreateReportPostInputDto,
  CreateReportPostOutputDto,
  GetReportPostsOutputDto,
} from './dtos/report-post.dto';
import {
  CreateReportUserInputDto,
  CreateReportUserOutputDto,
  GetReportUsersOutputDto,
} from './dtos/report-user.dto';
import { ReportsService } from './reports.service';

@Resolver()
export class ReportsResolver {
  constructor(private reportsService: ReportsService) {}

  @Mutation(() => CreateReportUserOutputDto)
  @UseGuards(GqlAuthGuard)
  createReportUser(
    @AuthUser() userId: UUID,
    @Args(args) args: CreateReportUserInputDto,
  ): Promise<CreateReportUserOutputDto> {
    return this.reportsService.createReportUser(userId, args);
  }

  // // Todo 관리자 계정
  // @Query(() => GetReportUsersOutputDto)
  // @UseGuards(GqlAuthGuard)
  // getReportUsers(): Promise<GetReportUsersOutputDto> {
  //   return this.reportsService.getReportUsers();
  // }

  @Mutation(() => CreateReportPostOutputDto)
  @UseGuards(GqlAuthGuard)
  createReportPost(
    @AuthUser() userId: UUID,
    @Args(args) args: CreateReportPostInputDto,
  ): Promise<CreateReportPostOutputDto> {
    return this.reportsService.createReportPost(userId, args);
  }

  // // Todo 관리자 계정
  // @Query(() => GetReportPostsOutputDto)
  // @UseGuards(GqlAuthGuard)
  // getReportPosts(): Promise<GetReportPostsOutputDto> {
  //   return this.reportsService.getReportPosts();
  // }

  @Mutation(() => CreateReportCommentOutputDto)
  @UseGuards(GqlAuthGuard)
  createReportComment(
    @AuthUser() userId: UUID,
    @Args(args) args: CreateReportCommentInputDto,
  ): Promise<CreateReportCommentOutputDto> {
    return this.reportsService.createReportComment(userId, args);
  }

  // // Todo 관리자 계정
  // @Query(() => GetReportCommentsOutputDto)
  // @UseGuards(GqlAuthGuard)
  // getReportComments(): Promise<GetReportCommentsOutputDto> {
  //   return this.reportsService.getReportComments();
  // }

  @Mutation(() => CreateReportBugOutputDto)
  @UseGuards(GqlAuthGuard)
  createReportBug(
    @AuthUser() userId: UUID,
    @Args(args) args: CreateReportBugInputDto,
  ): Promise<CreateReportBugOutputDto> {
    return this.reportsService.createReportBug(userId, args);
  }

  // // Todo 관리자 계정
  // @Query(() => GetReportBugsOutputDto)
  // @UseGuards(GqlAuthGuard)
  // getReportBugs(): Promise<GetReportBugsOutputDto> {
  //   return this.reportsService.getReportBugs();
  // }
}
