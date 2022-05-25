import { InputType, ObjectType } from '@nestjs/graphql';
import { CoreDogsOutputDto } from 'src/common/dtos/core-output.dto';

@InputType()
export class GetMyDogsInputDto {}

@ObjectType()
export class GetMyDogsOutputDto extends CoreDogsOutputDto {}
