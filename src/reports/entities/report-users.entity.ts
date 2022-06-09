import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEnum, IsString, IsUUID } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core-entity.entity';
import { UserProfile } from 'src/users/entities/users-profile.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

export enum ReportUsersType {
  ADVERTISMENT = 'ADVERTISEMENT', // 광고용 계정, 지나친 홍보행위
  VIOLATION_PATTERN = 'VIOLATION_PATTERN', // 커뮤니티 가이드 위반 행위 반복
  INAPPROPRIATE_PROFILE = 'INAPPROPRIATE_PROFILE', // 부적절한 프로필, 프로필사진, 사용자 이름.
  OTHER = 'OTHER', // 기타
}

registerEnumType(ReportUsersType, {
  name: 'ReportUsersType',
  description: 'ReportUsersType',
});

@Entity()
@InputType({ isAbstract: true })
@ObjectType()
export class ReportUsers extends CoreEntity {
  @Field(() => ReportUsersType)
  @IsEnum(ReportUsersType)
  @Column()
  reportType: ReportUsersType;

  @Field(() => String)
  @IsString()
  @Column()
  comment: string;

  @RelationId((reportUser: ReportUsers) => reportUser.reportUserProfile)
  @Field(() => String)
  @IsUUID()
  @Column()
  reportUserId: string;

  @RelationId((reportUser: ReportUsers) => reportUser.reportedUserProfile)
  @Field(() => String)
  @IsUUID()
  @Column()
  reportedUserId: string;

  // relations
  @ManyToOne(() => UserProfile, (userProfile) => userProfile.id)
  reportUserProfile: UserProfile;

  @ManyToOne(() => UserProfile, (userProfile) => userProfile.id)
  reportedUserProfile: UserProfile;
}
