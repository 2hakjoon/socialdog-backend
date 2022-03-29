import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from 'src/users/entities/users-profile.entity';
import { Subscribes } from './entities/subscribes.entity';
import { SubscribesResolver } from './subscribes.resolver';
import { SubscribesService } from './subscribes.service';
import { SubscribesUtil } from './subscribes.util';

@Module({
  imports: [TypeOrmModule.forFeature([UserProfile, Subscribes])],
  providers: [SubscribesResolver, SubscribesService, SubscribesUtil],
  exports: [SubscribesResolver, SubscribesService, SubscribesUtil],
})
export class SubscribesModule {}
