import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core-entity.entity';
import { Walks } from 'src/walks/entities/walks.entity';
import { Column, Entity, OneToMany } from 'typeorm';

export enum LoginStrategy {
  LOCAL = 'LOCAL',
  KAKAO = 'KAKAO',
}

registerEnumType(LoginStrategy, {
  name: 'LoginStrategy',
});

@Entity()
@InputType({ isAbstract: true })
@ObjectType()
export class UserProfile extends CoreEntity {
  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  username?: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  dogname?: string;

  @Field((type) => [Walks], { nullable: true })
  @OneToMany(() => Walks, (walk) => walk.user)
  walks?: Walks[];

  @Field((type) => LoginStrategy)
  @Column()
  loginStrategy: LoginStrategy;
}
