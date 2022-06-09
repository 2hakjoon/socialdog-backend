import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core-entity.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

@Entity()
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
export class ReportBugs extends CoreEntity {
  @Field(() => String)
  @IsString()
  @Column()
  comment: string;
}
