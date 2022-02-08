import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';
import { CoreOutputDto } from 'src/common/dtos/core-output-dto.dto';
import { User } from '../entities/users.entity';

@InputType()
export class GetProfileInputDto {
  @Field(() => Number)
  @IsNumber()
  userId: number;
}

@ObjectType()
export class GetProfileOutputDto extends CoreOutputDto {
  @Field(() => User, { nullable: true })
  data?: User;
}
