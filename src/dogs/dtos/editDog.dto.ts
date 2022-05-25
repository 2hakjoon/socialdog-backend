import {
  InputType,
  IntersectionType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { Dogs } from '../entities/dogs.entity';

@InputType()
export class EditDogInputDto extends IntersectionType(
  PartialType(PickType(Dogs, ['name', 'birthDay', 'photo'])),
  PickType(Dogs, ['id']),
) {}

@ObjectType()
export class EditDogOutputDto extends CoreOutputDto {}
