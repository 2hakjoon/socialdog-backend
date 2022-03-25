import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from 'src/users/entities/users-profile.entity';
import { JwtStrategy } from './auth.jwt-strategy';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategy/auth.local';
import { AuthResolver } from './auth.resolver';
import { AuthLocal } from './entities/auth-local.entity';
import { AuthKakao } from './entities/auth-kakao.entity';
import { IAuthInterface } from './auth.interface';
import { CONFIG_OPTIONS } from 'src/common/utils/constants';

@Module({})
@Global()
export class AuthModule {
  static forRoot(options: IAuthInterface): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        TypeOrmModule.forFeature([UserProfile, AuthLocal, AuthKakao]),
        PassportModule,
        JwtModule.register({
          secret: options.secretKey,
          signOptions: { expiresIn: options.accessTokenExpiresIn },
        }),
      ],
      providers: [
        { provide: CONFIG_OPTIONS, useValue: options },
        AuthService,
        AuthResolver,
        LocalStrategy,
        JwtStrategy,
        AuthLocal,
      ],
      exports: [LocalStrategy, AuthLocal],
    };
  }
}
