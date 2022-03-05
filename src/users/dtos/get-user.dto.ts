import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CoreUserOutputDto } from 'src/common/dtos/core-output.dto';
import { BlockState } from '../../subscribes/entities/subscribes.entity';

@InputType()
export class GetUserInputDto {
  @Field(() => String)
  @IsUUID()
  userId: string;
}

@ObjectType()
export class GetUserOutputDto extends CoreUserOutputDto {
  @Field(() => BlockState, { nullable: true })
  blocking?: BlockState;
}
