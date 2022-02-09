import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import {
  CreateWalkInputDto,
  CreateWalkOutputDto,
} from './dtos/create-walk.dto';
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
}
