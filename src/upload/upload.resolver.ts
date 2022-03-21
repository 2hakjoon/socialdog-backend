import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { args } from 'src/common/utils/constants';
import {
  CreatePreSignedUrlsInputDto,
  CreatePreSignedUrlsOutputDto,
} from './dtos/create-presigned-url.dto';
import { UploadService } from './upload.service';

@Resolver()
export class UploadResolver {
  constructor(private uploadService: UploadService) {}

  @Mutation((returns) => CreatePreSignedUrlsOutputDto)
  @UseGuards(GqlAuthGuard)
  createPreSignedUrls(
    @Args(args) args: CreatePreSignedUrlsInputDto,
  ): Promise<CreatePreSignedUrlsOutputDto> {
    return this.uploadService.getPreSignUrls(args);
  }
}
