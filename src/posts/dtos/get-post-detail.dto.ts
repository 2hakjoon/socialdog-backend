import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutputDto, PostAll } from 'src/common/dtos/core-output.dto';
import { Posts } from '../entities/posts.entity';

@InputType()
export class GetPostDetailInputDto extends PickType(Posts, ['id']) {}





@ObjectType()
export class GetPostDetailOutputDto extends CoreOutputDto {
  @Field(() => PostAll)
  data?: PostAll;
}
