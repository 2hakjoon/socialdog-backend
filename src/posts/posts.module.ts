import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Likes } from 'src/likes/entities/likes.entity';
import { Subscribes } from 'src/subscribes/entities/subscribes.entity';
import { SubscribesModule } from 'src/subscribes/subscribes.module';
import { UserProfile } from 'src/users/entities/users-profile.entity';
import { Posts } from './entities/posts.entity';
import { PostsResolver } from './posts.resolver';
import { PostsService } from './posts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Posts, UserProfile, Subscribes, Likes]),
    SubscribesModule,
  ],
  providers: [PostsService, PostsResolver],
})
export class PostsModule {}
