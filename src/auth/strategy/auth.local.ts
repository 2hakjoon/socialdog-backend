import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoginInputDto, LoginOutputDto } from '../dtos/login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  localLogin(loginInputDto: LoginInputDto): Promise<LoginOutputDto> {
    return this.authService.localLogin(loginInputDto);
  }
}
