import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
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

@ObjectType()
export class CursorArgs {
  @Field()
  @IsUUID()
  id: string;

  @Field()
  @IsString()
  createdAt: string;
}

@InputType()
export class CursorPaginationInputDto {
  @Field(() => Int)
  @IsNumber()
  @Max(20)
  take: number;

  @Field(() => CursorInput, { nullable: true })
  cursor?: CursorInput;
}

@InputType()
export class CursorPaginationArgs {
  @Field(() => Int)
  @IsNumber()
  @Max(20)
  take: number;

  @Field(() => CursorArgs)
  cursor: CursorArgs;
}
