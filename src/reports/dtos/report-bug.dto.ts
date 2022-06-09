import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import {
  CoreOutputDto,
  CoreReportBugsOutputDto,
} from 'src/common/dtos/core-output.dto';
import { ReportBugs } from '../entities/report-bugs.entity';

@InputType()
export class CreateReportBugInputDto extends PickType(ReportBugs, [
  'comment',
]) {}

@ObjectType()
export class CreateReportBugOutputDto extends CoreOutputDto {}

@InputType()
export class GetReportBugsInputDto {}

@ObjectType()
export class GetReportBugsOutputDto extends CoreReportBugsOutputDto {}
