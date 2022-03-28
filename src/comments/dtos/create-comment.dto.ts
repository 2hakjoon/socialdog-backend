import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { Comments } from '../entities/comments.entity';

@InputType()
export class CreateCommentInputDto extends PickType(Comments, ['content']) {}

@ObjectType()
export class CreateCommentOutputDto extends CoreOutputDto {}
