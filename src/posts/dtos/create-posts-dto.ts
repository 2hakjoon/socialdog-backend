import { InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutputDto } from "src/common/dtos/core-output.dto";
import { Posts } from "../entities/posts.entity";


@InputType()
export class CreatePostsInputDto extends PickType(Posts, ['address', 'contents','placeId']){}

@ObjectType()
export class CreatePostOutputDot extends CoreOutputDto {}