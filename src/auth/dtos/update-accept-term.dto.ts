import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutputDto } from 'src/common/dtos/core-output.dto';
import { AuthKakao } from '../entities/auth-kakao.entity';
import { AuthLocal } from '../entities/auth-local.entity';

@InputType()
export class UpdateAuthKakaoAcceptTermInputDto extends PickType(AuthKakao, [
  'acceptTerms',
]) {}

@ObjectType()
export class UpdateAuthKakaoAcceptTermOutputDto extends CoreOutputDto {}

@InputType()
export class UpdateAuthLocalAcceptTermInputDto extends PickType(AuthLocal, [
  'acceptTerms',
]) {}

@ObjectType()
export class UpdateAuthLocalAcceptTermOutputDto extends CoreOutputDto {}
