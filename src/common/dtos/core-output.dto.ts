import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/users.entity';
import { Walks } from 'src/walks/entities/walks.entity';

@ObjectType()
export class CoreOutputDto {
  @Field(() => Boolean)
  ok: boolean;

  @Field(() => String, { nullable: true })
  error?: string;
}

@ObjectType()
export class CoreUserOutputDto extends CoreOutputDto {
  @Field(() => User, { nullable: true })
  data?: User;
}

@ObjectType()
export class CoreWalksOutputDto extends CoreOutputDto {
  @Field(() => [Walks], { nullable: true })
  data?: Walks[];
}
