import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core-entity.entity';
import { UserProfile } from 'src/users/entities/users-profile.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

@Entity()
@InputType({ isAbstract: true })
@ObjectType()
export class Posts extends CoreEntity {
  @Field((type) => String)
  @Column()
  photos: string;

  @Field((type) => String)
  @IsString()
  @Column()
  address: string;

  @Field((type) => String)
  @IsString()
  @Column()
  placeId: string;

  @Field((type) => String)
  @IsString()
  @Column()
  contents: string;

  @Field((type) => UserProfile)
  @ManyToOne(() => UserProfile, (userProfile) => userProfile.posts)
  user: UserProfile;

  @Field(() => Int)
  @RelationId((posts: Posts) => posts.user)
  @Column()
  userId: number;

  @Field((type) => [UserProfile])
  @ManyToOne(() => UserProfile, (userProfile) => userProfile.liked)
  likes?: UserProfile[];
}
