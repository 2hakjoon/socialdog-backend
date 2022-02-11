import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import {
  ReissueAccessTokenInputDto,
  ReissueAccessTokenOutputDto,
} from './dtos/create-refresh-token.dto';
import { args } from '../common/constants';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => ReissueAccessTokenOutputDto)
  reissueAccessToken(
    @Args(args) args: ReissueAccessTokenInputDto,
  ): Promise<ReissueAccessTokenOutputDto> {
    return this.authService.reissuanceAccessToken(args);
  }
}
