import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreUserOutputDto } from 'src/common/dtos/core-output.dto';
import {
  BlockState,
  SubscribeRequestState,
} from '../../subscribes/entities/subscribes.entity';
import { UserProfile } from '../entities/users-profile.entity';

@InputType()
export class GetUserInputDto extends PickType(UserProfile, ['username']) {}

@ObjectType()
export class GetUserOutputDto extends CoreUserOutputDto {
  @Field(() => BlockState, { nullable: true })
  blocking?: BlockState;

  @Field(() => Boolean)
  profileOpened?: boolean;

  @Field(() => SubscribeRequestState)
  subscribeRequested?: SubscribeRequestState;
}
