import { InjectRepository } from '@nestjs/typeorm';
import {
  ToggleLikePostInputDto,
  ToggleLikePostOutputDto,
} from 'src/likes/dtos/toggle-like-post.dto';
import { Posts } from 'src/posts/entities/posts.entity';
import { UserProfile, UUID } from 'src/users/entities/users-profile.entity';
import { Repository } from 'typeorm';
import { Likes } from './entities/likes.entity';

export class LikesService {
  constructor(
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
    @InjectRepository(Posts)
    private postsRepository: Repository<Posts>,
    @InjectRepository(Likes)
    private likesRepository: Repository<Likes>,
  ) {}

  async toggleLikePost(
    { userId }: UUID,
    { postId }: ToggleLikePostInputDto,
  ): Promise<ToggleLikePostOutputDto> {
    try {
      const user = await this.userProfileRepository.findOne(
        { id: userId },
        { loadRelationIds: { relations: ['liked'] } },
      );
      if (!user) {
        return {
          ok: false,
          error: '사용자가 존재하지 않습니다.',
        };
      }

      const post = await this.postsRepository.findOne({ id: postId });
      if (!post) {
        return {
          ok: false,
          error: '게시물이 존재하지 않습니다.',
        };
      }

      const like = await this.likesRepository.findOne(
        { userId, postId },
        { loadRelationIds: { relations: ['user', 'post'] } },
      );

      if (!like) {
        await this.likesRepository.save(
          await this.likesRepository.create({
            post,
            postId: post.id,
            user,
            userId: userId,
            like: true,
          }),
        );
      } else {
        await this.likesRepository.delete({ id: like.id });
      }

      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '좋아요 요청이 실패하였습니다.',
      };
    }
  }
}
