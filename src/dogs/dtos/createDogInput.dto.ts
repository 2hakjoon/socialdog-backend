import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { Dogs } from '../entities/dogs.entity';

@InputType()
export class CreateDogInputDto extends PickType(Dogs, ['name', 'photo']) {
  @IsString()
  @Field(() => String, { nullable: true })
  birthDay?: string;
}

@ObjectType()
export class CreateDogOutputDto extends CoreOutputDto {}
