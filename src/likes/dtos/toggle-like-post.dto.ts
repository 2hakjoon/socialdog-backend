import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { Likes } from '../entities/likes.entity';

@InputType()
export class ToggleLikePostInputDto extends PickType(Likes, ['postId']) {}

@ObjectType()
export class ToggleLikePostOutputDto extends CoreOutputDto {}
