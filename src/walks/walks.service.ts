import { InjectRepository } from '@nestjs/typeorm';
import {
  CoreOutputDto,
  CoreWalksOutputDto,
} from 'src/common/dtos/core-output.dto';
import { User } from 'src/users/entities/users.entity';
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
  ) {}

  async createWalk(
    user: User,
    args: CreateWalkInputDto,
  ): Promise<CreateWalkOutputDto> {
    try {
      await this.walksRepository.save(
        this.walksRepository.create({ ...args, userId: user.id, user: user }),
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
    user: User,
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
        if (walk.userId !== user.id) {
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
      return { ok: true };
    } catch (e) {
      return { ok: false, error: '산책기록 조회에 실패했습니다.' };
    }
  }

  async getWalks(user: User): Promise<CoreWalksOutputDto> {
    try {
      const walks = await this.walksRepository.find({ userId: user.id });
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
    user: User,
    { walkId }: DeleteWalkInputDto,
  ): Promise<CoreOutputDto> {
    try {
      const walk = await this.walksRepository.findOne({ id: walkId });
      if (walk.userId !== user.id) {
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
