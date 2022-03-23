import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { Subscribes } from '../entities/subscribes.entity';

@InputType()
export class CancelSubscribeRequestInputDto extends PickType(Subscribes, [
  'to',
]) {}

@ObjectType()
export class CancelSubscribeRequestOutputDto extends CoreOutputDto {}
