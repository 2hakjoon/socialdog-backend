import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { Walks } from '../entities/walks.entity';

@InputType()
export class CreateWalkInputDto extends PickType(Walks, [
  'walkingTime',
  'startTime',
  'finishTime',
  'walkRecord',
]) {}

@ObjectType()
export class CreateWalkOutputDto extends CoreOutputDto {}
