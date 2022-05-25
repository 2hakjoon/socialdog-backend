import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreDogOutputDto } from 'src/common/dtos/core-output.dto';
import { Dogs } from '../entities/dogs.entity';

@InputType()
export class GetDogInputDto extends PickType(Dogs, ['id']) {}

@ObjectType()
export class GetDogOutputDto extends CoreDogOutputDto {}
