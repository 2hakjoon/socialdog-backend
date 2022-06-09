import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from 'src/comments/entities/comments.entity';
import { Posts } from 'src/posts/entities/posts.entity';
import { UserProfile, UUID } from 'src/users/entities/users-profile.entity';
import { Repository } from 'typeorm';
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
import { ReportBugs } from './entities/report-bugs.entity';
import { ReportComments } from './entities/report-comments.entity';
import { ReportPosts } from './entities/report-posts.entity';
import { ReportUsers } from './entities/report-users.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ReportUsers)
    private reportUsersRepository: Repository<ReportUsers>,
    @InjectRepository(ReportPosts)
    private reportPostsRepository: Repository<ReportPosts>,
    @InjectRepository(ReportComments)
    private reportCommentsRepository: Repository<ReportComments>,
    @InjectRepository(ReportBugs)
    private reportBugsRepository: Repository<ReportBugs>,
    @InjectRepository(UserProfile)
    private userProfilesRepository: Repository<UserProfile>,
    @InjectRepository(Posts)
    private postsRepository: Repository<Posts>,
    @InjectRepository(Comments)
    private commentsRepository: Repository<Comments>,
  ) {}

  async createReportUser(
    { userId }: UUID,
    { reportedUserId, reportType, comment }: CreateReportUserInputDto,
  ): Promise<CreateReportUserOutputDto> {
    try {
      const user = await this.userProfilesRepository.findOne({
        id: reportedUserId,
      });
      if (!user) {
        return {
          ok: false,
          error: '신고할 사용자가 존재하지 않습니다.',
        };
      }
      await this.reportUsersRepository.save(
        await this.reportUsersRepository.create({
          reportedUserProfile: user,
          reportedUserId,
          reportType,
          comment,
          reportUserId: userId,
        }),
      );
      return { ok: true };
    } catch (e) {
      // console.log(e)
      return { ok: false, error: '신고 접수 중 오류가 발생했습니다.' };
    }
  }

  async getReportUsers(): Promise<GetReportUsersOutputDto> {
    try {
      return { ok: true };
    } catch (e) {
      // console.log(e)
      return { ok: false, error: '신고 접수 중 오류가 발생했습니다.' };
    }
  }

  async createReportPost(
    { userId }: UUID,
    { reportedPostId, reportType, comment }: CreateReportPostInputDto,
  ): Promise<CreateReportPostOutputDto> {
    try {
      const post = await this.postsRepository.findOne({ id: reportedPostId });
      if (!post) {
        return {
          ok: false,
          error: '신고할 게시물이 존재하지 않습니다.',
        };
      }
      await this.reportPostsRepository.save(
        await this.reportPostsRepository.create({
          reportedPosts: post,
          reportedPostId,
          reportType,
          comment,
          reportUserId: userId,
        }),
      );
      return { ok: true };
    } catch (e) {
      // console.log(e)
      return { ok: false, error: '신고 접수 중 오류가 발생했습니다.' };
    }
  }

  async getReportPosts(): Promise<GetReportPostsOutputDto> {
    try {
      return { ok: true };
    } catch (e) {
      // console.log(e)
      return { ok: false, error: '신고 접수 중 오류가 발생했습니다.' };
    }
  }

  async createReportComment(
    { userId }: UUID,
    {
      reportedCommentId,
      reportType,
      comment: reportComment,
    }: CreateReportCommentInputDto,
  ): Promise<CreateReportCommentOutputDto> {
    try {
      const comment = await this.commentsRepository.findOne({
        id: reportedCommentId,
      });
      if (!comment) {
        return {
          ok: false,
          error: '신고할 댓글이 존재하지 않습니다.',
        };
      }
      await this.reportCommentsRepository.save(
        await this.reportCommentsRepository.create({
          reportedComments: comment,
          reportedCommentId,
          reportType,
          comment: reportComment,
          reportUserId: userId,
        }),
      );
      return { ok: true };
    } catch (e) {
      // console.log(e)
      return { ok: false, error: '신고 접수 중 오류가 발생했습니다.' };
    }
  }

  async getReportComments(): Promise<GetReportCommentsOutputDto> {
    try {
      return { ok: true };
    } catch (e) {
      // console.log(e)
      return { ok: false, error: '신고 접수 중 오류가 발생했습니다.' };
    }
  }

  async createReportBug(
    { userId }: UUID,
    args: CreateReportBugInputDto,
  ): Promise<CreateReportBugOutputDto> {
    try {
      await this.reportBugsRepository.save(
        await this.reportBugsRepository.create({
          ...args,
          reportUserId: userId,
        }),
      );
      return { ok: true };
    } catch (e) {
      // console.log(e)
      return { ok: false, error: '신고 접수 중 오류가 발생했습니다.' };
    }
  }

  async getReportBugs(): Promise<GetReportBugsOutputDto> {
    try {
      return { ok: true };
    } catch (e) {
      // console.log(e)
      return { ok: false, error: '신고 접수 중 오류가 발생했습니다.' };
    }
  }
}
