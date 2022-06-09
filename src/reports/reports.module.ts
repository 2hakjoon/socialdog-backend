import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from 'src/comments/entities/comments.entity';
import { Posts } from 'src/posts/entities/posts.entity';
import { UserProfile } from 'src/users/entities/users-profile.entity';
import { ReportBugs } from './entities/report-bugs.entity';
import { ReportComments } from './entities/report-comments.entity';
import { ReportPosts } from './entities/report-posts.entity';
import { ReportUsers } from './entities/report-users.entity';
import { ReportsResolver } from './reports.resolver';
import { ReportsService } from './reports.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserProfile,
      Posts,
      Comments,
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
