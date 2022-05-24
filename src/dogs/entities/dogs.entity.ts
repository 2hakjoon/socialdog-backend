import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core-entity.entity';
import { Column, Entity } from 'typeorm';

@Entity()
@ObjectType()
@InputType()
export class Dogs extends CoreEntity {
  @Column()
  @IsString()
  @Field(() => String)
  name: string;

  @Column()
  @IsString()
  @Field(() => String)
  photo: string;

  @Column({ nullable: true })
  @IsString()
  @Field(() => String, { nullable: true })
  birthDay?: string;
}
