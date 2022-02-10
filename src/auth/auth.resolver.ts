import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import {
  ReissueRefreshTokenInputDto,
  ReissueRefreshTokenOutputDto,
} from './dtos/create-refresh-token.dto';
import { args } from '../common/constants';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => ReissueRefreshTokenOutputDto)
  reissuanceAccessToken(
    @Args(args) args: ReissueRefreshTokenInputDto,
  ): Promise<ReissueRefreshTokenOutputDto> {
    return this.authService.reissuanceAccessToken(args);
  }
}
