import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { UserProfile } from '../entities/users-profile.entity';

@InputType()
export class CheckUsernameExistInputDto extends PickType(UserProfile, [
  'username',
]) {}

@ObjectType()
export class CheckUsernameExistOutputDto extends CoreOutputDto {
  @Field(() => Boolean)
  isExist?: boolean;
}
