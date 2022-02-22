import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { Walks } from '../entities/walks.entity';

@InputType()
export class GetWalkInputDto {
  @Field(() => String)
  @IsNumber()
  walkId: string;
}

@ObjectType()
export class GetWalkOutputDto extends CoreOutputDto {
  @Field(() => Walks, { nullable: true })
  data?: Walks;
}
