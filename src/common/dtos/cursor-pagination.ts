import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString, IsUUID, Max } from 'class-validator';

@InputType()
@ObjectType()
export class CursorArgs {
  @Field(() => String, { nullable: true })
  @IsUUID()
  id?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  createdAt?: string;
}

@InputType()
export class CursorPaginationInputDto {
  @Field(() => Int)
  @IsNumber()
  @Max(20)
  take: number;

  @Field(() => CursorArgs, { nullable: true })
  cursor?: CursorArgs;
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
