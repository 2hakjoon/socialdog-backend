import { Field, Int, ObjectType, PickType } from '@nestjs/graphql';
import { Dogs } from 'src/dogs/entities/dogs.entity';
import { Posts } from 'src/posts/entities/posts.entity';
import { ReportBugs } from 'src/reports/entities/report-bugs.entity';
import { ReportComments } from 'src/reports/entities/report-comments.entity';
import { ReportPosts } from 'src/reports/entities/report-posts.entity';
import { ReportUsers } from 'src/reports/entities/report-users.entity';
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

//reports
@ObjectType()
export class CoreReportUsersOutputDto extends CoreOutputDto {
  @Field(() => [ReportUsers], { nullable: true })
  data?: ReportUsers[];
}

@ObjectType()
export class CoreReportPostsOutputDto extends CoreOutputDto {
  @Field(() => [ReportPosts], { nullable: true })
  data?: ReportPosts[];
}

@ObjectType()
export class CoreReportCommentsOutputDto extends CoreOutputDto {
  @Field(() => [ReportComments], { nullable: true })
  data?: ReportComments[];
}

@ObjectType()
export class CoreReportBugsOutputDto extends CoreOutputDto {
  @Field(() => [ReportBugs], { nullable: true })
  data?: ReportBugs[];
}
