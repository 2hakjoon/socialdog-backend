import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import {
  CoreOutputDto,
  CoreReportPostsOutputDto,
} from 'src/common/dtos/core-output.dto';
import { ReportPosts } from '../entities/report-posts.entity';

@InputType()
export class CreateReportPostInputDto extends PickType(ReportPosts, [
  'comment',
  'reportType',
  'reportedPostId',
]) {}

@ObjectType()
export class CreateReportPostOutputDto extends CoreOutputDto {}

@InputType()
export class GetReportPostsInputDto {}

@ObjectType()
export class GetReportPostsOutputDto extends CoreReportPostsOutputDto {}
