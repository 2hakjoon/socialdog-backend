import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'src/users/entities/users-profile.entity';
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
    private reportBugssRepository: Repository<ReportBugs>,
  ) {}

  async createReportUser(
    { userId }: UUID,
    args: CreateReportUserInputDto,
  ): Promise<CreateReportUserOutputDto> {
    try {
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
    args: CreateReportPostInputDto,
  ): Promise<CreateReportPostOutputDto> {
    try {
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
    args: CreateReportCommentInputDto,
  ): Promise<CreateReportCommentOutputDto> {
    try {
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
