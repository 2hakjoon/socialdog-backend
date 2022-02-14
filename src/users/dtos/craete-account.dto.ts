import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { UserAuthLocal } from 'src/auth/entities/users-auth-local.dto';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';

@InputType()
export class CreateAccountInputDto extends PickType(UserAuthLocal, [
  'email',
  'password',
]) {
  @Field(() => String)
  @IsString()
  code: string;
}

@ObjectType()
export class CreateAccountOutputDto extends CoreOutputDto {}
