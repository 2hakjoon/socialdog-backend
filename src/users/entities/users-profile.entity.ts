import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { Comments } from 'src/comments/entities/comments.entity';
import { CoreEntity } from 'src/common/entity/core-entity.entity';
import { Likes } from 'src/likes/entities/likes.entity';
import { Posts } from 'src/posts/entities/posts.entity';
import { Walks } from 'src/walks/entities/walks.entity';
import { Column, Entity, JoinTable, OneToMany } from 'typeorm';
import { Subscribes } from '../../subscribes/entities/subscribes.entity';

export enum LoginStrategy {
  LOCAL = 'LOCAL',
  KAKAO = 'KAKAO',
}

registerEnumType(LoginStrategy, {
  name: 'LoginStrategy',
});

@Entity()
@InputType({ isAbstract: true })
@ObjectType({ isAbstract: true })
export class UserProfile extends CoreEntity {
  @Field((type) => String)
  @Column({ unique: true })
  @IsString()
  @Length(2, 15)
  username: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  @Length(0, 15)
  dogname?: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  photo?: string;

  @Field((type) => LoginStrategy)
  @Column()
  loginStrategy: LoginStrategy;

  @Field((type) => Boolean, { nullable: true })
  @Column({ default: false })
  profileOpen: boolean;

  //Relations

  @Field((type) => [Walks], { nullable: true })
  @OneToMany(() => Walks, (walk) => walk.user)
  walks?: Walks[];

  @Field((type) => [Posts], { nullable: true })
  @OneToMany(() => Posts, (posts) => posts.user)
  posts?: Posts[];

  @Field((type) => [Likes], { nullable: true })
  @OneToMany(() => Likes, (likes) => likes.user)
  liked?: Likes[];

  // Virtual Coulmn
  //내가 구독하는 사람들
  @Field((type) => Int)
  subscribings?: number;

  //나를 구독하는 사람들
  @Field((type) => Int)
  subscribers?: number;

  //내가 구독하는 사람들
  @Field((type) => [Subscribes], { nullable: true })
  @OneToMany(() => Subscribes, (subscribes) => subscribes.from)
  subscribingUsers?: Subscribes[];

  //나를 구독하는 사람들
  @Field((type) => [Subscribes], { nullable: true })
  @OneToMany(() => Subscribes, (subscribes) => subscribes.to)
  subscribeUsers?: Subscribes[];

  @Field((type) => [Comments], { nullable: true })
  @OneToMany(() => Comments, (comments) => comments.id)
  comments?: Comments[];
}

export class UUID {
  userId: string;
}
