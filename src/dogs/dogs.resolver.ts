import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser, GqlAuthGuard } from 'src/auth/auth.guard';
import { CreateDogInputDto, CreateDogOutputDto } from './dtos/createDog.dto';
import { args } from 'src/common/utils/constants';
import { Dogs } from './entities/dogs.entity';
import { DogsService } from './dogs.service';
import { UUID } from 'src/users/entities/users-profile.entity';
import { DeleteDogInputDto, DeleteDogOutputDto } from './dtos/deleteDog.dto';
import { EditDogInputDto, EditDogOutputDto } from './dtos/editDog.dto';
import { GetDogInputDto, GetDogOutputDto } from './dtos/getDog.dto';
import { GetMyDogsInputDto, GetMyDogsOutputDto } from './dtos/getMyDogs.dto';

@Resolver((of) => Dogs)
export class DogsResolver {
  constructor(private dogsService: DogsService) {}

  @Mutation(() => CreateDogOutputDto)
  @UseGuards(GqlAuthGuard)
  createDog(
    @AuthUser() AuthUser: UUID,
    @Args(args) args: CreateDogInputDto,
  ): Promise<CreateDogOutputDto> {
    return this.dogsService.createDog(AuthUser, args);
  }

  @Mutation(() => DeleteDogOutputDto)
  @UseGuards(GqlAuthGuard)
  deleteDog(
    @AuthUser() AuthUser: UUID,
    @Args(args) args: DeleteDogInputDto,
  ): Promise<DeleteDogOutputDto> {
    return this.dogsService.deleteDog(AuthUser, args);
  }

  @Mutation(() => EditDogOutputDto)
  @UseGuards(GqlAuthGuard)
  editDog(
    @AuthUser() AuthUser: UUID,
    @Args(args) args: EditDogInputDto,
  ): Promise<EditDogOutputDto> {
    return this.dogsService.editDog(AuthUser, args);
  }

  @Query(() => GetDogOutputDto)
  @UseGuards(GqlAuthGuard)
  getDog(
    @AuthUser() AuthUser: UUID,
    @Args(args) args: GetDogInputDto,
  ): Promise<GetDogOutputDto> {
    return this.dogsService.getDog(AuthUser, args);
  }

  @Query(() => GetMyDogsOutputDto)
  @UseGuards(GqlAuthGuard)
  getMyDogs(@AuthUser() AuthUser: UUID): Promise<GetMyDogsOutputDto> {
    return this.dogsService.getMyDogs(AuthUser);
  }
}
