import { Field, InputType, PickType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { UserAuthLocal } from 'src/auth/entities/users-auth-local.dto';
import { UserProfile } from '../entities/users-profile.entity';

@InputType()
export class CreateVerificationInputDto extends PickType(UserAuthLocal, [
  'email',
]) {}

@InputType()
export class VerifyEmailAndCodeInputDto extends PickType(UserAuthLocal, [
  'email',
]) {
  @Field(() => String)
  @IsString()
  code: string;
}
