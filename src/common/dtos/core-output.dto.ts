import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Posts } from 'src/posts/entities/posts.entity';
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
export class UserProfileAll extends UserProfile {
  //내가 구독하는 사람들
  @Field((type) => Int)
  subscribings?: number;

  //나를 구독하는 사람들
  @Field((type) => Int)
  subscribers?: number;
}

@ObjectType()
export class CoreUserOutputDto extends CoreOutputDto {
  @Field(() => UserProfileAll, { nullable: true })
  data?: UserProfileAll;
}

@ObjectType()
export class CoreWalksOutputDto extends CoreOutputDto {
  @Field(() => [Walks], { nullable: true })
  data?: Walks[];
}

@ObjectType()
export class PostAll extends Posts {
  @Field((type) => Int, { nullable: true })
  likes?: number;

  @Field((type) => Boolean, { nullable: true })
  isLiked?: boolean;
}

@ObjectType()
export class CorePostsOutputDto extends CoreOutputDto {
  @Field(() => [PostAll])
  data?: PostAll[];
}

@ObjectType()
export class CorePostOutputDto extends CoreOutputDto {
  @Field(() => PostAll)
  data?: PostAll;
}
