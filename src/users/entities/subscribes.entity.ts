import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core-entity.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UserProfile } from './users-profile.entity';

@Entity()
@InputType({ isAbstract: true })
@ObjectType()
export class Subscribes extends CoreEntity {
  @Field(() => String)
  @ManyToOne(() => UserProfile, (user) => user.id)
  from: string;

  @Field(() => String)
  @ManyToOne(() => UserProfile, (user) => user.id)
  to: string;
}
