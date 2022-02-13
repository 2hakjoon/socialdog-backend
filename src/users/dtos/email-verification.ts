import { Field, InputType, PickType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { User } from '../entities/users.entity';

@InputType()
export class CreateVerificationInputDto extends PickType(User, ['email']) {}

@InputType()
export class VerifyEmailAndCodeInputDto extends PickType(User, ['email']) {
  @Field(() => String)
  @IsString()
  code: string;
}
