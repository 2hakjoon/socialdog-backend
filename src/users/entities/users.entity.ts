import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';
import { type } from 'os';
import { CoreEntity } from 'src/common/entity/core-entity.entity';
import { Column } from 'typeorm';

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
}
