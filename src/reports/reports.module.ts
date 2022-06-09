import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportBugs } from './entities/report-bugs.entity';
import { ReportComments } from './entities/report-comments.entity';
import { ReportPosts } from './entities/report-posts.entity';
import { ReportUsers } from './entities/report-users.entity';
import { ReportsResolver } from './reports.resolver';
import { ReportsService } from './reports.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReportBugs,
      ReportComments,
      ReportPosts,
      ReportUsers,
    ]),
  ],
  exports: [ReportsResolver, ReportsService],
  providers: [ReportsResolver, ReportsService],
})
export class ReportsModule {}
