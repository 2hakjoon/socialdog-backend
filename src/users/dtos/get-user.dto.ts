import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { BlockState } from '../entities/subscribes.entity';
import { UserProfile } from '../entities/users-profile.entity';

@InputType()
export class GetUserInputDto {
  @Field(() => String)
  @IsString()
  userId: string;
}

@ObjectType()
export class GetUserOutputDto extends CoreOutputDto {
  @Field(() => UserProfile, { nullable: true })
  data?: UserProfile;

  @Field(() => BlockState, { nullable: true })
  blocking?: BlockState;
}
