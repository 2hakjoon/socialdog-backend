import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { Subscribes } from '../entities/subscribes.entity';

@InputType()
export class ChangeBlockStateInputDto extends PickType(Subscribes, [
  'to',
  'block',
]) {}

@ObjectType()
export class ChangeBlockStateOutputDto extends CoreOutputDto {}
