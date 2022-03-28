import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsResolver } from './comments.resolver';
import { CommentsService } from './comments.service';
import { Comments } from './entities/comments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comments])],
  providers: [CommentsResolver, CommentsService],
})
export class CommentsModule {}
