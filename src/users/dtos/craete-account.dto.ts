import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { User } from '../entities/users.entity';

@InputType()
export class CreateAccountInputDto extends PickType(User, [
  'username',
  'email',
  'password',
]) {
  @Field(() => String)
  @IsNumber()
  code: string;
}

@ObjectType()
export class CreateAccountOutputDto extends CoreOutputDto {}
