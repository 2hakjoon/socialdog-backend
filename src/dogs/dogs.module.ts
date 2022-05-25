import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from 'src/users/entities/users-profile.entity';
import { DogsResolver } from './dogs.resolver';
import { DogsService } from './dogs.service';
import { Dogs } from './entities/dogs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dogs, UserProfile])],
  providers: [DogsResolver, DogsService],
  exports: [DogsResolver, DogsService],
})
export class DogsModule {}
