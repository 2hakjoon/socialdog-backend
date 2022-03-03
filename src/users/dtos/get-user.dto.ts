import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { BlockState } from '../../subscribes/entities/subscribes.entity';
import { UserProfile } from '../entities/users-profile.entity';

@InputType()
export class GetUserInputDto {
  @Field(() => String)
  @IsUUID()
  userId: string;
}

@ObjectType()
export class GetUserOutputDto extends CoreOutputDto {
  @Field(() => UserProfile, { nullable: true })
  data?: UserProfile;

  @Field(() => BlockState, { nullable: true })
  blocking?: BlockState;
}
