import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { UserProfile } from '../entities/users-profile.entity';

@InputType()
export class GetUserInputDto {
  @Field(() => Int)
  @IsNumber()
  userId: number;
}

@ObjectType()
export class GetUserOutputDto extends CoreOutputDto {
  @Field(() => UserProfile, { nullable: true })
  data?: UserProfile;
}
