import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthLocal } from 'src/auth/entities/auth-local.entity';
import { UserProfile } from 'src/users/entities/users-profile.entity';
import { Verifies } from './entities/verifies.entity';
import { MailService } from './mail.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Verifies, UserProfile, AuthLocal]),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
