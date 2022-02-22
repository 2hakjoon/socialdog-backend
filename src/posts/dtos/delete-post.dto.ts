import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { Posts } from '../entities/posts.entity';

@InputType()
export class DeletePostInputDto extends PickType(Posts, ['id']) {}

@ObjectType()
export class DeletePostOutputDto extends CoreOutputDto {}
