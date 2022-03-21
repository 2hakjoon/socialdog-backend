import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsString, IsUUID, Max } from 'class-validator';

@InputType()
class CursorInput {
  @Field()
  @IsUUID()
  id: string;

  @Field()
  @IsString()
  createdAt: string;
}

@InputType()
export class CursorPagination {
  @Field(() => Int)
  @IsNumber()
  @Max(20)
  take: number;
}
