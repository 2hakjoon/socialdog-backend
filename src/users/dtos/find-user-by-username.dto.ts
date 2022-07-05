import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { UserProfile } from '../entities/users-profile.entity';

@InputType()
export class FindUserByUsernameInputDto {
  @Field(() => String)
  @IsString()
  @Length(2)
  username: string;
}

@ObjectType()
export class FindUserByUsernameOutputDto extends CoreOutputDto {
  @Field(() => [UserProfile], { nullable: true })
  data?: UserProfile[];
}
