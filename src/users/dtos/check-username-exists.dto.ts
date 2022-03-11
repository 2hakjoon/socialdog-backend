import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';

@InputType()
export class CheckUsernameExistInputDto {
  @Field(() => String)
  @IsString()
  @Length(2)
  username: string;
}

@ObjectType()
export class CheckUsernameExistOutputDto extends CoreOutputDto {
  @Field(() => Boolean)
  isExist?: boolean;
}
