import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { IsEnum, IsString } from "class-validator";
import { CoreOutputDto } from "src/common/dtos/core-output.dto";


export enum FileType {
  IMAGE = 'image/*',
}

registerEnumType(FileType, {
  name: 'FileType',
  description: 'upload file type.',
});

@InputType()
export class CreatePreSignedUrlInputDto{
  @Field(type=>String)
  @IsString()
  filename: string

  @Field(type=>FileType)
  @IsEnum(FileType)
  fileType: FileType
}

@ObjectType()
export class CreatePreSignedUrlOutputDto extends CoreOutputDto{}