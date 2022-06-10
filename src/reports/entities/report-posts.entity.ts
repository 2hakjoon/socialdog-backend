import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEnum, IsString, IsUUID } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core-entity.entity';
import { Posts } from 'src/posts/entities/posts.entity';
import { UserProfile } from 'src/users/entities/users-profile.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

export enum ReportPostsType {
  ADVERTISMENT = 'ADVERTISEMENT', // 광고행위
  NEGATIVE_POST = 'NEGATIVE_POST', // 욕설/비방/혐오 등 부정적인 게시물
  SEXUAL_CONTENTS = 'SEXUAL_CONTENTS', // 성적인 콘텐츠
  OTHER = 'OTHER', // 기타
}

registerEnumType(ReportPostsType, {
  name: 'ReportPostsType',
  description: 'ReportPostsType',
});

@Entity()
@InputType({ isAbstract: true })
@ObjectType()
export class ReportPosts extends CoreEntity {
  @Field(() => ReportPostsType)
  @IsEnum(ReportPostsType)
  @Column()
  reportType: ReportPostsType;

  @Field(() => String)
  @IsString()
  @Column()
  comment: string;

  @RelationId((reportPosts: ReportPosts) => reportPosts.reportUserProfile)
  @Field(() => String)
  @IsUUID()
  @Column()
  reportUserId: string;

  @RelationId((reportPosts: ReportPosts) => reportPosts.reportedPosts)
  @Field(() => String)
  @IsUUID()
  @Column()
  reportedPostId: string;

  // relations

  @ManyToOne(() => UserProfile, (userProfile) => userProfile.id)
  reportUserProfile: UserProfile;

  @ManyToOne(() => Posts, (posts) => posts.id)
  reportedPosts: Posts;
}
