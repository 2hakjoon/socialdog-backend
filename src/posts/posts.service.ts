import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfile } from 'src/users/entities/users-profile.entity';
import { Repository } from 'typeorm';
import { CreatePostOutputDot, CreatePostsInputDto } from './dtos/create-posts-dto';
import { Posts } from './entities/posts.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private postsRepository : Repository<Posts>
  ) {}

  async createPost(user:UserProfile, args:CreatePostsInputDto):Promise<CreatePostOutputDot>{
    return {
      ok:true
    }
  }
}
