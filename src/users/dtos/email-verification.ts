import { Field, InputType, PickType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { AuthLocal } from 'src/auth/entities/auth-local.entity';
import { UserProfile } from '../entities/users-profile.entity';

@InputType()
export class CreateVerificationInputDto extends PickType(AuthLocal, [
  'email',
]) {}

@InputType()
export class VerifyEmailAndCodeInputDto extends PickType(AuthLocal, ['email']) {
  @Field(() => String)
  @IsString()
  code: string;
}
