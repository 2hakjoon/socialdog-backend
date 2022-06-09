import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import {
  CoreOutputDto,
  CoreReportCommentsOutputDto,
} from 'src/common/dtos/core-output.dto';
import { ReportComments } from '../entities/report-comments.entity';

@InputType()
export class CreateReportCommentInputDto extends PickType(ReportComments, [
  'comment',
  'reportedCommentId',
  'reportType',
]) {}

@ObjectType()
export class CreateReportCommentOutputDto extends CoreOutputDto {}

@InputType()
export class GetReportCommentsInputDto {}

@ObjectType()
export class GetReportCommentsOutputDto extends CoreReportCommentsOutputDto {}
