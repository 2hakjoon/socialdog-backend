import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from 'src/posts/entities/posts.entity';
import { UserProfile } from 'src/users/entities/users-profile.entity';
import { Likes } from './entities/likes.entity';
import { LikesResolver } from './likes.resolver';
import { LikesService } from './likes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Likes, UserProfile, Posts])],
  providers: [LikesService, LikesResolver],
  exports: [LikesService, LikesResolver],
})
export class LikesModule {}
