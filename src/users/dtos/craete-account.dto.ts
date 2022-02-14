import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { User } from '../entities/users-profile.entity';

@InputType()
export class CreateAccountInputDto extends PickType(User, [
  'email',
  'password',
]) {
  @Field(() => String)
  @IsString()
  code: string;
}

@ObjectType()
export class CreateAccountOutputDto extends CoreOutputDto {}
