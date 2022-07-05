import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { UserProfile } from '../entities/users-profile.entity';

@InputType()
export class GetProfileOpenUserInputDto {}

@ObjectType()
export class GetProfileOpenUserOutputDto extends CoreOutputDto {
  @Field(() => [UserProfile])
  data?: UserProfile[];
}
