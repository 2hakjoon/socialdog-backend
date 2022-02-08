import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CoreOutputDto {
  @Field((returns) => Boolean)
  ok: boolean;

  @Field((returns) => String, { nullable: true })
  error?: string;
}
