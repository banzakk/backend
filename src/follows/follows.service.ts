import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@src/users/entities/user.entity';
import { FollowUserData } from '@src/users/types/users';
import { Repository } from 'typeorm';
import { CreateFollowDto } from './dto/create-follow.dto';
import { Follow } from './entities/follow.entity';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow) private followsRepository: Repository<Follow>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  async addFollow(createFollowDto: CreateFollowDto, userId) {
    const { id } = createFollowDto;
    await this.createFollow(id, userId);
  }

  async deleteFollow(deleteFollowDto: CreateFollowDto, userId: number) {
    const { id } = deleteFollowDto;
    await this.deleteFollowByIdAndUserId(id, userId);
  }

  async createFollow(id: number, userId: number): Promise<void> {
    try {
      const follower = await this.usersRepository.findOneBy({ id });
      const following = await this.usersRepository.findOneBy({ id: userId });

      if (!follower || !following) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }

      const follow = new Follow();
      follow.follower = follower;
      follow.following = following;
      await this.followsRepository.save(follow);
    } catch (err) {
      console.error(err);
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException(
        '팔로우 생성 중 오류가 발생했습니다.',
      );
    }
  }

  async getFollowersByUserId(
    userId: number,
  ): Promise<Partial<FollowUserData>[]> {
    const data = await this.followsRepository
      .createQueryBuilder('follow')
      .leftJoinAndSelect('follow.following', 'user')
      .where('follow.following_user_id = :id', { id: userId })
      .getMany()
      .then((follow) => {
        if (follow) {
          return follow.map((data) => {
            return {
              userId: data.following.id,
              name: data.following.name,
              userCustomId: data.following.user_custom_id,
            };
          });
        }
      });
    return data;
  }

  async getFollowingsByUserId(
    userId: number,
  ): Promise<Partial<FollowUserData>[]> {
    const data = await this.followsRepository
      .createQueryBuilder('follow')
      .leftJoinAndSelect('follow.follower', 'user')
      .where('follow.followed_user_id = :id', { id: userId })
      .getMany()
      .then((follow) => {
        if (follow) {
          return follow.map((data) => {
            return {
              userId: data.follower.id,
              name: data.follower.name,
              userCustomId: data.follower.user_custom_id,
            };
          });
        }
      });
    return data;
  }

  async deleteFollowByIdAndUserId(id: number, userId: number) {
    try {
      const follower = await this.usersRepository.findOneBy({ id: userId });
      const following = await this.usersRepository.findOneBy({ id });

      if (!follower || !following) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }

      await this.followsRepository
        .createQueryBuilder('follow')
        .delete()
        .from(Follow)
        .where('followed_user_id = :follower', { follower: follower.id })
        .andWhere('following_user_id = :following', { following: following.id })
        .execute();
    } catch (err) {
      console.error(err);
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException(
        '팔로우 해제 중 오류가 발생했습니다.',
      );
    }
  }

  async findFollowingUserId(accessUserId: number) {
    try {
      return (
        await this.followsRepository
          .createQueryBuilder('test')
          .select('follows.following_user_id')
          .leftJoin(
            Follow,
            'follows',
            'follows.followed_user_id = :accessUserId',
          )
          .setParameter('accessUserId', accessUserId)
          .distinct(true)
          .getRawMany()
      ).map((data) => data.following_user_id);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('팔로잉 유저를 찾을 수 없습니다.');
    }
  }
}
