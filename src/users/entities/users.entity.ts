import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core-entity.entity';
import { Walks } from 'src/walks/entities/walks.entity';
import { Column, Entity, OneToMany, RelationId } from 'typeorm';

@Entity()
@ObjectType()
export class User extends CoreEntity {
  @Field((type) => String)
  @Column()
  @IsString()
  username: string;

  @Field((type) => String)
  @Column()
  @IsEmail()
  email: string;

  @Field((type) => String)
  @Column()
  @IsString()
  password: string;

  @Field((type) => String)
  @Column()
  @IsString()
  dogname: string;

  @Field((type) => [Walks])
  @OneToMany(() => Walks, (walk) => walk.user)
  walks: Walks[];
}
