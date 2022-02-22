import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entity/core-entity.entity';
import { Column, Entity } from 'typeorm';

@Entity()
@InputType()
@ObjectType()
export class AuthKakao extends CoreEntity {
  @Field(() => String)
  @Column()
  @IsString()
  kakaoId: string;

  @Field((type) => String)
  @Column()
  userId: string;

  @Field((type) => String)
  @Column()
  @IsString()
  refreshToken?: string;
}
