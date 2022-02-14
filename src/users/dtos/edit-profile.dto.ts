import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { UserProfile } from '../entities/users-profile.entity';

@InputType()
export class EditProfileInputDto extends PartialType(
  PickType(UserProfile, ['username', 'dogname']),
) {}

@ObjectType()
export class EditProfileOutputDto extends CoreOutputDto {
  @Field(() => UserProfile, { nullable: true })
  data?: UserProfile;
}
