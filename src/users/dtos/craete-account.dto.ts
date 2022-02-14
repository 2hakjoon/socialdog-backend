import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { AuthLocal } from 'src/auth/entities/auth-local.entity';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';

@InputType()
export class CreateAccountInputDto extends PickType(AuthLocal, [
  'email',
  'password',
]) {
  @Field(() => String)
  @IsString()
  code: string;
}

@ObjectType()
export class CreateAccountOutputDto extends CoreOutputDto {}
