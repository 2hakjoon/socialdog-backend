import { Field, InputType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class DeleteWalkInputDto {
  @Field(() => Number)
  @IsNumber()
  walkId: number;
}
