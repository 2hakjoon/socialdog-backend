import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { User } from '../entities/users-profile.entity';

@InputType()
export class EditProfileInputDto extends PartialType(
  PickType(User, ['username', 'dogname', 'password']),
) {}

@ObjectType()
export class EditProfileOutputDto extends CoreOutputDto {
  @Field(() => User, { nullable: true })
  data?: User;
}
