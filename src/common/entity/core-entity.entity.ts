import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export class CoreEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  @IsString()
  id: string;

  @CreateDateColumn({ precision: 3 })
  @Field(() => String)
  @IsString()
  createdAt: string;

  @UpdateDateColumn({ precision: 3 })
  @Field(() => String)
  @IsString()
  updatedAt: string;
}
