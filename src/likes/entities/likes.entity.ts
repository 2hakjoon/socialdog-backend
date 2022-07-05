import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core-entity.entity';
import { Posts } from 'src/posts/entities/posts.entity';
import { UserProfile } from 'src/users/entities/users-profile.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

@Entity()
@InputType({ isAbstract: true })
@ObjectType()
export class Likes extends CoreEntity {
  @Field(() => UserProfile)
  @ManyToOne(() => UserProfile, (userProfile) => userProfile.liked, {
    onDelete: 'CASCADE',
  })
  user: UserProfile;

  @Field(() => String)
  @RelationId((likes: Likes) => likes.user)
  @Column()
  userId: string;

  @Field(() => Posts)
  @ManyToOne(() => Posts, (posts) => posts.likedUsers, { onDelete: 'CASCADE' })
  post: Posts;

  @Field(() => String)
  @RelationId((likes: Likes) => likes.post)
  @IsUUID()
  @Column()
  postId: string;

  @Field(() => Boolean)
  @Column()
  like: boolean;
}
