import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core-entity.entity';
import { User } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

@Entity()
@ObjectType()
export class Walks extends CoreEntity {
  @Field((type) => String)
  @Column()
  @IsNumber()
  walkingTime: number;

  @Field((type) => Int)
  @Column()
  @IsNumber()
  startTime: number;

  @Field((type) => Int)
  @Column()
  @IsNumber()
  finishTime: number;

  @Field((type) => String)
  @Column()
  @IsString()
  walkRecord: string;

  @ManyToOne(() => User, (user) => user.walks, { onDelete: 'CASCADE' })
  user: User;

  @RelationId((walks: Walks) => walks.user)
  userId: number;
}
