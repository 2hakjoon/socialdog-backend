import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DogsResolver } from './dogs.resolver';
import { DogsService } from './dogs.service';
import { Dogs } from './entities/dogs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dogs])],
  providers: [DogsResolver, DogsService],
  exports: [DogsResolver, DogsService],
})
export class DogsModule {}
