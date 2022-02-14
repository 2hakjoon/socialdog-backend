import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core-entity.entity';
import { UserProfile } from 'src/users/entities/users-profile.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

@Entity()
@InputType({ isAbstract: true })
@ObjectType()
export class Walks extends CoreEntity {
  @Field((type) => Int)
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

  @Field((type) => UserProfile, { nullable: true })
  @ManyToOne(() => UserProfile, (userprofile) => userprofile.walks, {
    onDelete: 'CASCADE',
  })
  user: UserProfile;

  @Field((type) => Int, { nullable: true })
  @RelationId((walks: Walks) => walks.user)
  @Column()
  userId: number;
}
