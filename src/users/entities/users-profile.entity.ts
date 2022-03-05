import {
  Field,
  InputType,
  Int,
  ObjectType,
  PickType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core-entity.entity';
import { Posts } from 'src/posts/entities/posts.entity';
import { Walks } from 'src/walks/entities/walks.entity';
import { AfterLoad, Column, Entity, OneToMany } from 'typeorm';
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
  @Field((type) => String, { nullable: true })
  @Column({ nullable: true, unique: true })
  @IsString()
  @Length(0, 20)
  username?: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  @Length(0, 20)
  dogname?: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  photo?: string;

  @Field((type) => LoginStrategy)
  @Column()
  loginStrategy: LoginStrategy;

  //Relations

  @Field((type) => [Walks], { nullable: true })
  @OneToMany(() => Walks, (walk) => walk.user)
  walks?: Walks[];

  @Field((type) => [Posts], { nullable: true })
  @OneToMany(() => Posts, (posts) => posts.user)
  posts?: Posts[];

  @Field((type) => [Posts], { nullable: true })
  @OneToMany(() => Posts, (posts) => posts.likedUsers)
  liked?: Posts[];

  //내가 구독하는 사람들
  @Field((type) => [Subscribes], { nullable: true })
  @OneToMany(() => Subscribes, (subscribes) => subscribes.to)
  subscribingUsers?: Subscribes[];

  //나를 구독하는 사람들
  @Field((type) => [Subscribes], { nullable: true })
  @OneToMany(() => Subscribes, (subscribes) => subscribes.from)
  subscribeUsers?: Subscribes[];
}

export class UUID {
  userId: string;
}
