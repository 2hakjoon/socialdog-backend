import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core-entity.entity';
import { UserProfile } from 'src/users/entities/users-profile.entity';
import {
  AfterLoad,
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  RelationId,
} from 'typeorm';

@Entity()
@InputType({ isAbstract: true })
@ObjectType()
export class Posts extends CoreEntity {
  @Field((type) => String)
  @Column()
  photos: string;

  @Field((type) => String)
  @IsString()
  @Length(0, 50)
  @Column()
  address: string;

  @Field((type) => String)
  @IsString()
  @Length(0, 50)
  @Column()
  placeId: string;

  @Field((type) => String)
  @IsString()
  @Length(0, 300)
  @Column()
  contents: string;

  @Field((type) => UserProfile)
  @ManyToOne(() => UserProfile, (userProfile) => userProfile.posts, {
    eager: true,
  })
  user: UserProfile;

  @Field(() => String)
  @RelationId((posts: Posts) => posts.user)
  @Column()
  userId: string;

  @Field((type) => [UserProfile])
  @ManyToOne(() => UserProfile, (userProfile) => userProfile.liked)
  likes?: UserProfile[];

  @Field((type) => Int)
  likeCounts: number;

  @Field((type) => Boolean)
  @Column({ default: false })
  isLiked: boolean;

  @AfterLoad()
  public async countLikes() {
    this.likeCounts = this.likes?.length || 0;
  }
}
