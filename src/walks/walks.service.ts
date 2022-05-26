import { InjectRepository } from '@nestjs/typeorm';
import {
  CoreOutputDto,
  CoreWalksOutputDto,
} from 'src/common/dtos/core-output.dto';
import { Dogs } from 'src/dogs/entities/dogs.entity';
import { UserProfile, UUID } from 'src/users/entities/users-profile.entity';
import { Repository } from 'typeorm';
import {
  CreateWalkInputDto,
  CreateWalkOutputDto,
} from './dtos/create-walk.dto';
import { DeleteWalkInputDto } from './dtos/delete-walk.dto';
import { GetWalkInputDto, GetWalkOutputDto } from './dtos/get-walk.dto';
import { Walks } from './entities/walks.entity';

export class WalksService {
  constructor(
    @InjectRepository(Walks)
    private walksRepository: Repository<Walks>,
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
    @InjectRepository(Dogs)
    private dogsRepository: Repository<Dogs>,
  ) {}

  async createWalk(
    { userId }: UUID,
    { dogId, ...rest }: CreateWalkInputDto,
  ): Promise<CreateWalkOutputDto> {
    try {
      const user = await this.userProfileRepository.findOne({ id: userId });
      if (!user) {
        return {
          ok: false,
          error: '사용자 정보를 찾을 수 없습니다.',
        };
      }
      const dog = await this.dogsRepository.findOne({ id: dogId });
      await this.walksRepository.save(
        this.walksRepository.create({
          ...rest,
          userId,
          user,
          dogId,
          dog,
        }),
      );
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '산책정보 저장에 실패했습니다.',
      };
    }
  }

  async getWalk(
    { userId }: UUID,
    { walkId }: GetWalkInputDto,
  ): Promise<GetWalkOutputDto> {
    try {
      try {
        const walk = await this.walksRepository.findOne({ id: walkId });
        if (!walk) {
          return {
            ok: false,
            error: '산책정보가 없습니다.',
          };
        }
        if (walk.userId !== userId) {
          return {
            ok: false,
            error: '다른사람의 산책정보는 조회 할 수 없습니다.',
          };
        }
        return {
          ok: true,
          data: walk,
        };
      } catch (e) {
        console.log(e);
        return {
          ok: false,
          error: '산책정보 조회에 실패했습니다.',
        };
      }
    } catch (e) {
      return { ok: false, error: '산책기록 조회에 실패했습니다.' };
    }
  }

  async getWalks({ userId }: UUID): Promise<CoreWalksOutputDto> {
    try {
      const walks = await this.walksRepository.find({ userId });
      return {
        ok: true,
        data: walks,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: '산책정보 조회에 실패했습니다.',
      };
    }
  }

  async deleteWalks(
    { userId }: UUID,
    { walkId }: DeleteWalkInputDto,
  ): Promise<CoreOutputDto> {
    try {
      const walk = await this.walksRepository.findOne({ id: walkId });
      if (walk.userId !== userId) {
        return {
          ok: false,
          error: '다른사람의 산책정보는 삭제할 수 없습니다.',
        };
      }
      await this.walksRepository.delete(walkId);
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: '산책정보 삭제에 실패했습니다.',
      };
    }
  }
}
