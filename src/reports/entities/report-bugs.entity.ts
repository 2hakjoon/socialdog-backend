import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core-entity.entity';
import { UserProfile } from 'src/users/entities/users-profile.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { ReportUsers } from './report-users.entity';

@Entity()
@InputType({ isAbstract: true })
@ObjectType()
export class ReportBugs extends CoreEntity {
  @Field(() => String)
  @IsString()
  @Column()
  comment: string;

  @RelationId((reportUser: ReportUsers) => reportUser.reportUserProfile)
  @Field(() => String)
  @IsUUID()
  @Column()
  reportUserId: string;

  // relations
  @ManyToOne(() => UserProfile, (userProfile) => userProfile.id)
  reportUserProfile: UserProfile;
}
