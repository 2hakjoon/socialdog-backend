import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthLocal } from 'src/auth/entities/auth-local.entity';
import { MailModule } from 'src/mail/mail.module';
import { Subscribes } from './entities/subscribes.entity';
import { UserProfile } from './entities/users-profile.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([UserProfile, AuthLocal, Subscribes]),
    MailModule,
  ],
  exports: [UsersResolver, UsersService],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
