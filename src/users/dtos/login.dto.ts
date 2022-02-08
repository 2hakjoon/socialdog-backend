import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/core-output-dto.dto';
import { User } from '../entities/users.entity';

@InputType()
export class LoginInputDto extends PickType(User, ['email', 'password']) {}

@ObjectType()
export class LoginOutputDto extends CoreOutputDto {
  @Field(() => String, { nullable: true })
  token?: string;
}
