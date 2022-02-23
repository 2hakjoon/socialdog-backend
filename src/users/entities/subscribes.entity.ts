import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core-entity.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UserProfile } from './users-profile.entity';

export enum SubscribeStatus {
  REQUESTED = 'REQUESTED',
  REJECTED = 'REJECTED',
  CONFIRMED = 'CONFIRMED',
}

registerEnumType(SubscribeStatus, {
  name: 'SubscribeStatus',
  description: 'SubscribeStatus',
});

@Entity()
@InputType({ isAbstract: true })
@ObjectType()
export class Subscribes extends CoreEntity {
  @Field(() => String)
  @ManyToOne(() => UserProfile, (user) => user.id)
  from: string;

  @Field(() => String)
  @IsString()
  @ManyToOne(() => UserProfile, (user) => user.id)
  to: string;

  @Field(() => SubscribeStatus)
  @Column({ nullable: true })
  @IsEnum(SubscribeStatus)
  subscribeRequest?: SubscribeStatus;

  @Field(() => Boolean)
  @Column({ default: false })
  block: boolean;
}
