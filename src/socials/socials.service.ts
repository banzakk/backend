import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthType } from '@src/auth/types/auth-type';
import { Repository } from 'typeorm';
import { Social } from './entities/social.entity';

@Injectable()
export class SocialsService {
  constructor(
    @InjectRepository(Social) private socialRepository: Repository<Social>,
  ) {}
  async getSocialIdByType(type: AuthType): Promise<number> {
    try {
      const social = await this.socialRepository.findOne({
        where: { type },
      });
      return social.id;
    } catch (err) {
      throw new InternalServerErrorException(
        '소셜 로그인 타입 조회 중 오류가 발생했습니다.',
      );
    }
  }
}
