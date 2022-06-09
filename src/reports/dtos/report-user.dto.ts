import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import {
  CoreOutputDto,
  CoreReportUsersOutputDto,
} from 'src/common/dtos/core-output.dto';
import { ReportUsers } from '../entities/report-users.entity';

@InputType()
export class CreateReportUserInputDto extends PickType(ReportUsers, [
  'comment',
  'reportType',
  'reportedUserId',
]) {}

@ObjectType()
export class CreateReportUserOutputDto extends CoreOutputDto {}

@InputType()
export class GetReportUsersInputDto {}

@ObjectType()
export class GetReportUsersOutputDto extends CoreReportUsersOutputDto {}
