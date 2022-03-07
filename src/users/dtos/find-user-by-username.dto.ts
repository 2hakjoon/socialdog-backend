import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreOutputDto, UserProfileAll } from 'src/common/dtos/core-output.dto';
import { BlockState } from '../../subscribes/entities/subscribes.entity';

@InputType()
export class FindUserByUsernameInputDto {
  @Field(() => String)
  @IsString()
  @Length(2)
  username: string;
}

@ObjectType()
export class FindUserByUsernameOutputDto extends CoreOutputDto {
  @Field(() => [UserProfileAll], { nullable: true })
  data?: UserProfileAll[];
}
