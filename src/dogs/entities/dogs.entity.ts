import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core-entity.entity';
import { UserProfile } from 'src/users/entities/users-profile.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

@Entity()
@InputType({ isAbstract: true })
@ObjectType()
export class Dogs extends CoreEntity {
  @Column()
  @IsString()
  @Field((type) => String)
  name: string;

  @Column()
  @IsString()
  @Field((type) => String)
  photo: string;

  @Column({ nullable: true })
  @IsString()
  @Field(() => String, { nullable: true })
  birthDay?: string;

  //relationIds
  @Field(() => String)
  @RelationId((dogs: Dogs) => dogs.user)
  @Column()
  userId: string;

  //relation
  @Field((type) => [UserProfile])
  @ManyToOne(() => UserProfile, (userProfile) => userProfile.dogs, {
    onDelete: 'CASCADE',
  })
  user: UserProfile;
}
