import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileUpload } from 'graphql-upload';
import { UploadService } from 'src/upload/upload.service';
import { UserProfile } from 'src/users/entities/users-profile.entity';
import { Repository } from 'typeorm';
import { CreatePostOutputDot, CreatePostsInputDto } from './dtos/create-posts-dto';
import { Posts } from './entities/posts.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private postsRepository : Repository<Posts>,
    private uploadServices: UploadService
  ) {}

  async createPost(user:UserProfile, args:CreatePostsInputDto, files:Promise<FileUpload>[]):Promise<CreatePostOutputDot>{
    try{
      if(!user.id){
        return {
          ok:false,
          error:"유저정보를 찾을 수 없습니다."
        }
      }
      const photoUrls = await this.uploadServices.uploadFilesToS3("postPhoto/", files)
      await this.postsRepository.save(
        await this.postsRepository.create({
          ...args,
          photos : JSON.stringify(photoUrls),
          user,
          userId:user.id
        })
      )
    }
    catch(e){
      return{
        ok:false,
        error:"게시물 생성에 실패하였습니다."
      }
    }
    return {
      ok:true
    }
  }
}
