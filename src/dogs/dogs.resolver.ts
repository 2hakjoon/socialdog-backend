import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UUID } from 'aws-sdk/clients/cloudtrail';
import { AuthUser, GqlAuthGuard } from 'src/auth/auth.guard';
import {
  CreateDogInputDto,
  CreateDogOutputDto,
} from './dtos/createDogInput.dto';
import { args } from 'src/common/utils/constants';
import { Dogs } from './entities/dogs.entity';

@Resolver((of) => Dogs)
export class DogsResolver {
  @Mutation(() => CreateDogOutputDto)
  @UseGuards(GqlAuthGuard)
  createDog(
    @AuthUser() AuthUser: UUID,
    @Args(args) args: CreateDogInputDto,
  ): Promise<CreateDogOutputDto> {
    return;
  }
}
