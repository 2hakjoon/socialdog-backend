import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { Subscribes } from '../entities/subscribes.entity';

@InputType()
export class ResponseSubscribeInputDto extends PickType(Subscribes, [
  'from',
  'subscribeRequest',
]) {}

@ObjectType()
export class ResponseSubscribeOutputDto extends CoreOutputDto {}
