import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  exports: [UsersResolver],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
