import { Field, Int, ObjectType, PickType } from '@nestjs/graphql';
import { Dogs } from 'src/dogs/entities/dogs.entity';
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
export class CoreUserOutputDto extends CoreOutputDto {
  @Field(() => UserProfile, { nullable: true })
  data?: UserProfile;
}

@ObjectType()
export class UserProfileCard extends PickType(UserProfile, [
  'id',
  'username',
  'photo',
]) {}

//posts

@ObjectType()
export class CorePostsOutputDto extends CoreOutputDto {
  @Field(() => [Posts])
  data?: Posts[];

  @Field(() => Int)
  length?: number;
}

@ObjectType()
export class CorePostOutputDto extends CoreOutputDto {
  @Field(() => Posts)
  data?: Posts;
}

//walks
@ObjectType()
export class CoreWalksOutputDto extends CoreOutputDto {
  @Field(() => [Walks], { nullable: true })
  data?: Walks[];
}

//dogs
@ObjectType()
export class CoreDogsOutputDto extends CoreOutputDto {
  @Field(() => [Dogs], { nullable: true })
  data?: Dogs[];
}

@ObjectType()
export class CoreDogOutputDto extends CoreOutputDto {
  @Field(() => Dogs, { nullable: true })
  data?: Dogs;
}
