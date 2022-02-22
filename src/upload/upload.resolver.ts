import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "src/auth/auth.guard";
import { args } from "src/common/constants";
import { CreatePreSignedUrlInputDto, CreatePreSignedUrlOutputDto } from "./dtos/create-presigned-url.dto";
import { UploadService } from "./upload.service";


@Resolver()
export class UploadResolver {

  constructor(
    private uploadService : UploadService
  ){}

  @Mutation(returns=>CreatePreSignedUrlOutputDto)
  @UseGuards(GqlAuthGuard)
  createPreSignedUrl(@Args(args) args:CreatePreSignedUrlInputDto):Promise<CreatePreSignedUrlOutputDto>{
    return this.uploadService.getPreSignUrl(args)
  }
}