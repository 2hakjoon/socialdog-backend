import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEnum, IsString, IsUUID } from 'class-validator';
import { Comments } from 'src/comments/entities/comments.entity';
import { CoreEntity } from 'src/common/entity/core-entity.entity';
import { Posts } from 'src/posts/entities/posts.entity';
import { UserProfile } from 'src/users/entities/users-profile.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

export enum ReportPostsType {
  ADVERTISMENT = 'ADVERTISEMENT', // 광고용 계정, 지나친 홍보행위
  NEGATIVE_POST = 'NEGATIVE_POST', // 욕설/비방/혐오 등 부정적인 게시물
  SEXUAL_CONTENTS = 'SEXUAL_CONTENTS', // 성적인 콘텐츠
  OTHER = 'OTHER', // 기타
}

registerEnumType(ReportPostsType, {
  name: 'ReportUsersType',
  description: 'ReportUsersType',
});

@Entity()
@ObjectType({ isAbstract: true })
@InputType()
export class ReportPosts extends CoreEntity {
  @Field(() => String)
  @IsEnum(ReportPostsType)
  @Column()
  reportType: ReportPostsType;

  @Field(() => String)
  @IsString()
  @Column()
  comment: string;

  @RelationId((userProfile: UserProfile) => userProfile.id)
  @Field(() => String)
  @IsUUID()
  @Column()
  reportUserId: string;

  @RelationId((comments: Comments) => comments.id)
  @Field(() => String)
  @IsUUID()
  @Column()
  reportedCommentId: string;

  // relations

  @ManyToOne(() => UserProfile, (userProfile) => userProfile.id)
  reportUserProfile: UserProfile;

  @ManyToOne(() => Comments, (comments) => comments.id)
  reportedComments: Comments;
}
