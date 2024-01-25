import {
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '@src/users/users.service';
import { WhispersService } from '@src/whispers/whispers.service';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like) private likeRepository: Repository<Like>,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => WhispersService))
    private readonly whispersService: WhispersService,
  ) {}

  async createLike(userId: number, whisperId: number) {
    try {
      const like = new Like();
      like.user = await this.usersService.findUserId(userId);
      like.whisper = await this.whispersService.findWhisper(whisperId);
      await this.likeRepository.save(like);
      return { message: '좋아요를 성공했습니다.' };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('좋아요를 실패했습니다.');
    }
  }

  async deleteLike(userId: number, whisperId: number) {
    try {
      const existingLike = await this.likeRepository.findOne({
        where: {
          user: { id: userId },
          whisper: { id: whisperId },
        },
      });

      if (!existingLike) {
        throw new InternalServerErrorException(
          '좋아요 기록을 찾을 수 없습니다.',
        );
      }

      await this.likeRepository
        .createQueryBuilder('like')
        .delete()
        .where('user_id = :id', { id: userId })
        .andWhere('whisper_id = :whisperId', { whisperId: whisperId })
        .execute();
      return { message: '좋아요 해제를 성공했습니다.' };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('좋아요 해제를 실패했습니다.');
    }
  }
}
