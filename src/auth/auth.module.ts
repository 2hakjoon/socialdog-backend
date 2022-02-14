import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from 'src/users/entities/users-profile.entity';
import { JwtStrategy } from './auth.jwt-strategy';
import { AuthService } from './auth.service';
import { secret } from './key.secret';
import { LocalStrategy } from './strategy/auth.local';
import { AuthResolver } from './auth.resolver';
import { AuthLocal } from './entities/auth-local.dto';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserProfile, AuthLocal]),
    PassportModule,
    JwtModule.register({
      secret: secret, //랜덤 키 string
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, AuthResolver, LocalStrategy, JwtStrategy, AuthLocal],
  exports: [LocalStrategy, AuthLocal],
})
export class AuthModule {}
