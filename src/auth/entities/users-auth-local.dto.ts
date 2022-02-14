import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core-entity.entity';
import { Column, Entity } from 'typeorm';

@Entity()
@InputType({ isAbstract: true })
@ObjectType()
export class UserAuthLocal extends CoreEntity {
  @Field((type) => String)
  @Column({ unique: true, nullable: true })
  @IsEmail()
  email?: string;

  @Field((type) => String)
  @Column({ select: false })
  @IsString()
  password?: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  refreshToken: string;
}