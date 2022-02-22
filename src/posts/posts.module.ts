import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CONFIG_OPTIONS } from 'src/common/constants';
import { UploadModule } from 'src/upload/upload.module';
import { UploadService } from 'src/upload/upload.service';
import { Posts } from './entities/posts.entity';
import { PostsResolver } from './posts.resolver';
import { PostsService } from './posts.service';

@Module({
  imports:[TypeOrmModule.forFeature([Posts])],
  providers: [PostsService, PostsResolver]
})
export class PostsModule {}
