import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core-entity.entity';
import { UserProfile } from 'src/users/entities/users-profile.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
@InputType()
@ObjectType()
export class AuthKakao extends CoreEntity {
  @Field(() => String)
  @Column()
  @IsString()
  kakaoId: string;

  @Field(() => Boolean)
  @Column({ default: false })
  @IsBoolean()
  acceptTerms: boolean;

  @Field((type) => String)
  @ManyToOne(() => UserProfile, (user) => user.id, { onDelete: 'CASCADE' })
  user: UserProfile;

  @Field((type) => String)
  @Column()
  @IsString()
  refreshToken?: string;
}
