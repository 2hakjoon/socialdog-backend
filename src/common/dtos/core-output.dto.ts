import { Field, Int, ObjectType, PickType } from '@nestjs/graphql';
import { UserProfile } from 'src/users/entities/users-profile.entity';
import { Walks } from 'src/walks/entities/walks.entity';

@ObjectType()
export class CoreOutputDto {
  @Field(() => Boolean)
  ok: boolean;

  @Field(() => String, { nullable: true })
  error?: string;
}

@ObjectType()
class UserProfileDto {
  @Field((type) => Int)
  id: number;

  @Field((type) => String, { nullable: true })
  dogname?: string;
}

@ObjectType()
export class CoreUserOutputDto extends CoreOutputDto {
  @Field(() => UserProfileDto, { nullable: true })
  data?: UserProfileDto;
}

@ObjectType()
export class CoreWalksOutputDto extends CoreOutputDto {
  @Field(() => [Walks], { nullable: true })
  data?: Walks[];
}
