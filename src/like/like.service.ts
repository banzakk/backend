import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
    private readonly whispersService: WhispersService,
  ) {}

  async createLike(userId: number, whisperId: number) {
    try {
      const like = new Like();
      like.user = await this.usersService.findUserId(userId);
      like.whisper = await this.whispersService.findWhisper(whisperId);
      await this.likeRepository.save(like);
      return '좋아요를 생성하는데 성공했습니다.';
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        '좋아요를 생성하는데 실패했습니다.'
      );
    }
  }
}
