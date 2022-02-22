import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadService } from 'src/upload/upload.service';
import { UserProfile } from 'src/users/entities/users-profile.entity';
import { Repository } from 'typeorm';
import {
  CreatePostOutputDot,
  CreatePostInputDto,
} from './dtos/create-post-dto';
import {
  DeletePostInputDto,
  DeletePostOutputDto,
} from './dtos/delete-post.dto';
import { Posts } from './entities/posts.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private postsRepository: Repository<Posts>,
    private uploadService: UploadService,
  ) {}

  async createPost(
    user: UserProfile,
    args: CreatePostInputDto,
  ): Promise<CreatePostOutputDot> {
    try {
      if (!user.id) {
        return {
          ok: false,
          error: '유저정보를 찾을 수 없습니다.',
        };
      }
      await this.postsRepository.save(
        await this.postsRepository.create({
          ...args,
          photos: JSON.stringify(args.photos),
          user,
          userId: user.id,
        }),
      );
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '게시물 생성에 실패하였습니다.',
      };
    }
  }

  async deletePost(
    user: UserProfile,
    { id }: DeletePostInputDto,
  ): Promise<DeletePostOutputDto> {
    try {
      const post = await this.postsRepository.findOne({ id });
      if (!post) {
        return {
          ok: false,
          error: '게시글이 존재하지 않습니다.',
        };
      }
      if (post.userId !== user.id) {
        return {
          ok: false,
          error: '다른 사람의 게시글은 삭제할수 없습니다.',
        };
      }
      const photos = JSON.parse(post.photos);
      const deletePromises = photos.map((photo) =>
        this.uploadService.deleteFileAtS3(photo),
      );
      await Promise.all(deletePromises).catch(() => {
        throw new Error('s3파일 삭제 실패');
      });

      await this.postsRepository.remove(post);
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '게시물 삭제에 실패했습니다.',
      };
    }
  }
}