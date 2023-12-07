import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { UserSocial } from './entities/user-social.entity';

@Injectable()
export class UserSocialsService {
  constructor(
    @InjectRepository(UserSocial)
    private userSocialRepository: Repository<UserSocial>,
  ) {}

  async saveUserSocial(socialId, userId, email, queryRunner: QueryRunner) {
    try {
      const userSocials = new UserSocial();
      userSocials.socials = socialId;
      userSocials.user = userId;
      userSocials.email = email;
      if (!queryRunner) {
        await this.userSocialRepository.save(userSocials);
        return;
      }
      await queryRunner.manager.save(userSocials);
    } catch (err) {
      throw new InternalServerErrorException(
        '소셜 정보 저장 중 오류가 발생했습니다.',
      );
    }
  }
}
