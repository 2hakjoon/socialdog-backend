import { Field, InputType, Int, PickType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { User } from '../entities/users.entity';

@InputType()
export class CreateVerificationInputDto extends PickType(User, ['email']) {}

@InputType()
export class VerifyEmailAndCodeInputDto extends PickType(User, ['email']) {
  @Field(() => String)
  @IsNumber()
  code: string;
}
