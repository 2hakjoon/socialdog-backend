import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { UserProfile } from 'src/users/entities/users-profile.entity';

@ObjectType()
export class GetMySubscribingsOutputDto extends CoreOutputDto {
  @Field(() => [UserProfile])
  data?: UserProfile[];
}
