import { Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateReportBugOutputDto,
  GetReportBugsOutputDto,
} from './dtos/report-bug.dto';
import {
  CreateReportCommentOutputDto,
  GetReportCommentsOutputDto,
} from './dtos/report-comment.dto';
import {
  CreateReportPostOutputDto,
  GetReportPostsOutputDto,
} from './dtos/report-post.dto';
import {
  CreateReportUserOutputDto,
  GetReportUsersOutputDto,
} from './dtos/report-user.dto';

@Resolver()
export class ReportsResolver {
  @Mutation(() => CreateReportUserOutputDto)
  createReportUser() {}

  @Query(() => GetReportUsersOutputDto)
  getReportUsers() {}

  @Mutation(() => CreateReportPostOutputDto)
  createReportPost() {}

  @Query(() => GetReportPostsOutputDto)
  getReportPosts() {}

  @Mutation(() => CreateReportCommentOutputDto)
  createReportComment() {}

  @Query(() => GetReportCommentsOutputDto)
  getReportComments() {}

  @Mutation(() => CreateReportBugOutputDto)
  createReportBug() {}

  @Query(() => GetReportBugsOutputDto)
  getReportBugs() {}
}
