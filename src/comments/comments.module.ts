import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from 'src/posts/entities/posts.entity';
import { Subscribes } from 'src/subscribes/entities/subscribes.entity';
import { UserProfile } from 'src/users/entities/users-profile.entity';
import { CommentsResolver } from './comments.resolver';
import { CommentsService } from './comments.service';
import { Comments } from './entities/comments.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comments, Posts, Subscribes, UserProfile]),
  ],
  providers: [CommentsResolver, CommentsService],
})
export class CommentsModule {}
