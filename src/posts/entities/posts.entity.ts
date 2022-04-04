import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { Comments } from 'src/comments/entities/comments.entity';
import { CoreEntity } from 'src/common/entity/core-entity.entity';
import { Likes } from 'src/likes/entities/likes.entity';
import { UserProfile } from 'src/users/entities/users-profile.entity';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';

@Entity()
@InputType({ isAbstract: true })
@ObjectType()
export class Posts extends CoreEntity {
  @Field((type) => String)
  @Column()
  photos: string;

  @Field((type) => String, { nullable: true })
  @IsString()
  @Length(0, 50)
  @Column({ nullable: true })
  address?: string;

  @Field((type) => String, { nullable: true })
  @IsString()
  @Length(0, 50)
  @Column({ nullable: true })
  placeId?: string;

  @Field((type) => String)
  @IsString()
  @Length(0, 300)
  @Column()
  contents: string;

  @Field(() => String)
  @RelationId((posts: Posts) => posts.user)
  @Column()
  userId: string;

  // Virtual Column
  @Field(() => Int, { nullable: true })
  commentCounts?: number;

  @Field((type) => Int, { nullable: true })
  likes?: number;

  @Field((type) => Boolean, { nullable: true })
  liked?: boolean;

  // Relation
  @Field((type) => UserProfile)
  @ManyToOne(() => UserProfile, (userProfile) => userProfile.posts, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: UserProfile;

  @Field((type) => [Likes], { nullable: true })
  @OneToMany(() => Likes, (likes) => likes.post)
  likedUsers?: Likes[];

  @Field((type) => [Comments], { nullable: true })
  @OneToMany(() => Comments, (comments) => comments.post)
  comments?: Comments[];
}
