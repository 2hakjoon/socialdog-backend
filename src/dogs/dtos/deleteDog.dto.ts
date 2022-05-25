import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { Dogs } from '../entities/dogs.entity';

@InputType()
export class DeleteDogInputDto extends PickType(Dogs, ['id']) {}

@ObjectType()
export class DeleteDogOutputDto extends CoreOutputDto {}
