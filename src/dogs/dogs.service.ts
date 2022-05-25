import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfile, UUID } from 'src/users/entities/users-profile.entity';
import { Repository } from 'typeorm';
import { CreateDogInputDto, CreateDogOutputDto } from './dtos/createDog.dto';
import { DeleteDogInputDto, DeleteDogOutputDto } from './dtos/deleteDog.dto';
import { EditDogInputDto, EditDogOutputDto } from './dtos/editDog.dto';
import { GetDogInputDto, GetDogOutputDto } from './dtos/getDog.dto';
import { GetMyDogsOutputDto } from './dtos/getMyDogs.dto';
import { Dogs } from './entities/dogs.entity';

@Injectable()
export class DogsService {
  constructor(
    @InjectRepository(Dogs)
    private dogsRepository: Repository<Dogs>,
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
  ) {}

  async createDog(
    { userId }: UUID,
    args: CreateDogInputDto,
  ): Promise<CreateDogOutputDto> {
    try {
      const user = await this.userProfileRepository.findOne({ id: userId });
      if (!user) {
        return { ok: false, error: '사용자를 찾을 수 없습니다.' };
      }
      const dog = await this.dogsRepository.save(
        this.dogsRepository.create({ ...args, user, userId }),
      );
      return { ok: true };
    } catch (e) {
      //console.log(e)
      return { ok: false, error: '반려견 등록에 실패했습니다.' };
    }
  }

  async getDog(
    { userId }: UUID,
    { id }: GetDogInputDto,
  ): Promise<GetDogOutputDto> {
    try {
      const dog = await this.dogsRepository.findOne(id);
      if (!dog) {
        return {
          ok: false,
          error: '반려견 정보를 찾을 수 없습니다.',
        };
      }
      if (dog.userId !== userId) {
        return {
          ok: false,
          error: '자신의 반려견만 조회할 수 있습니다.',
        };
      }
      return { ok: true, data: dog };
    } catch (e) {
      //console.log(e)
      return { ok: false, error: '반려견 정보 조회에 실패했습니다.' };
    }
  }

  async getMyDogs({ userId }: UUID): Promise<GetMyDogsOutputDto> {
    try {
      const dogs = await this.dogsRepository.find({
        userId,
      });

      return {
        ok: true,
        data: dogs,
      };
    } catch (e) {
      //console.log(e)
      return { ok: false, error: '반려견 목록 조회에 실패했습니다.' };
    }
  }

  async editDog(
    { userId }: UUID,
    args: EditDogInputDto,
  ): Promise<EditDogOutputDto> {
    try {
      const dog = await this.dogsRepository.findOne({ id: args.id });
      if (!dog) {
        return {
          ok: false,
          error: '반려견 정보를 찾을 수 없습니다.',
        };
      }
      if (dog.userId !== userId) {
        return {
          ok: false,
          error: '자신의 반려견 정보만 수정할 수 있습니다.',
        };
      }
      await this.dogsRepository.update({ id: args.id }, { ...dog, ...args });
      return { ok: true };
    } catch (e) {
      //console.log(e)
      return { ok: false, error: '반려견 정보 수정에 실패했습니다.' };
    }
  }

  async deleteDog(
    { userId }: UUID,
    args: DeleteDogInputDto,
  ): Promise<DeleteDogOutputDto> {
    try {
      const dog = await this.dogsRepository.findOne({ id: args.id });
      if (!dog) {
        return {
          ok: false,
          error: '반려견 정보를 찾을 수 없습니다.',
        };
      }
      if (dog.userId !== userId) {
        return {
          ok: false,
          error: '자신의 반려견 정보만 삭제할 수 있습니다.',
        };
      }
      await this.dogsRepository.delete({ id: args.id });
      return {
        ok: true,
      };
    } catch (e) {
      //console.log(e)
      return { ok: false, error: '반려견 정보 삭제에 실패했습니다.' };
    }
  }
}
