import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './entities/posts.entity';
import { PostsResolver } from './posts.resolver';
import { PostsService } from './posts.service';

@Module({
  imports:[TypeOrmModule.forFeature([Posts])],
  providers: [PostsService, PostsResolver]
})
export class PostsModule {}
