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

export enum RequestStatus {
  REQUESTED = 'REQUESTED',
  REJECTED = 'REJECTED',
  CONFIRMED = 'CONFIRMED',
}

registerEnumType(RequestStatus, {
  name: 'RequestStatus',
  description: 'RequestStatus',
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

  @Field(() => RequestStatus)
  @Column({ nullable: true })
  @IsEnum(RequestStatus)
  subscribeRequest?: RequestStatus;

  @Field(() => Boolean)
  @Column({ default: false })
  block: boolean;
}
