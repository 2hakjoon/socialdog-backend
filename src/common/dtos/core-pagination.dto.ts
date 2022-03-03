import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class CorePagination {
  @Field(() => Int)
  @IsNumber()
  offset: number;

  @Field(() => Int)
  @IsNumber()
  limit: number;
}
