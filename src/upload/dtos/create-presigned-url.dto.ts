import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsObject,
  IsString,
} from 'class-validator';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';

export enum FileType {
  IMAGE = 'image/*',
}

registerEnumType(FileType, {
  name: 'FileType',
  description: 'upload file type.',
});

@InputType()
class FileInputDto {
  @Field((type) => String)
  @IsString()
  filename: string;

  @Field((type) => FileType)
  @IsEnum(FileType)
  fileType: FileType;
}

@InputType()
export class CreatePreSignedUrlsInputDto {
  @Field((type) => [FileInputDto])
  @IsArray()
  @ArrayMaxSize(5)
  files: FileInputDto[];
}

@ObjectType()
export class CreatePreSignedUrlsOutputDto extends CoreOutputDto {
  @Field((type) => [String])
  urls: string[];
}
