import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { JwtStrategy } from './auth.jwt-strategy';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { secret } from './key.secret';
import { LocalStrategy } from './strategy/auth.local';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: secret, //랜덤 키 string
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, AuthResolver, LocalStrategy, JwtStrategy],
  exports: [LocalStrategy],
})
export class AuthModule {}
