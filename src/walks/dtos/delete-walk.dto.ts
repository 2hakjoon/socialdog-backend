import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class DeleteWalkInputDto {
  @Field(() => Int)
  @IsNumber()
  walkId: number;
}
