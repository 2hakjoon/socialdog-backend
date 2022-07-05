import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsString, IsUUID, Length } from 'class-validator';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { Subscribes } from '../entities/subscribes.entity';

@InputType()
export class ChangeBlockStateInputDto extends PickType(Subscribes, ['block']) {
  @Field(() => String, { nullable: true })
  @IsString()
  @Length(2)
  username?: string;
}

@ObjectType()
export class ChangeBlockStateOutputDto extends CoreOutputDto {}
