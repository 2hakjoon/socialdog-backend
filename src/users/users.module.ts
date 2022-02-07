import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolvers';

@Module({
  exports: [UsersResolver],
  providers: [UsersResolver],
})
export class UsersModule {}
