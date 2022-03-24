import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { AuthLocal } from '../entities/auth-local.entity';

@InputType()
export class LoginInputDto extends PickType(AuthLocal, ['email', 'password']) {}

@ObjectType()
export class LoginOutputDto extends CoreOutputDto {
  @Field(() => String, { nullable: true })
  accessToken?: string;

  @Field(() => String, { nullable: true })
  refreshToken?: string;

  @Field(() => Boolean, { nullable: true })
  isJoin?: boolean;
}
