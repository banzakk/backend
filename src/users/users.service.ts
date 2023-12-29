import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthType } from '@src/auth/types/auth-type';
import { FollowsService } from '@src/follows/follows.service';
import { SocialsService } from '@src/socials/socials.service';
import { UserProfileImage } from '@src/user-profile-images/entities/user-profile-image.entity';
import { UserSocial } from '@src/user-socials/entities/user-social.entity';
import { UserSocialsService } from '@src/user-socials/user-socials.service';
import { User } from '@src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import * as uuid from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UserData } from './types/users';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(UserSocial)
    private userSocialRepository: Repository<UserSocial>,
    private readonly socialsService: SocialsService,
    private readonly userSocialsService: UserSocialsService,
    private readonly followsService: FollowsService,
    private dataSource: DataSource,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const userExist = await this.isEmailExist(email);
    if (userExist) {
      throw new BadRequestException('해당 email로는 가입할 수 없습니다.');
    }
    return await this.createUser(createUserDto);
  }

  async socialSignUpTransaction(email: string, name: string, type: AuthType) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await this.createSocialUser(name, queryRunner);
      const socialId = await this.socialsService.getSocialIdByType(type);
      await this.userSocialsService.saveUserSocial(
        socialId,
        user.id,
        email,
        queryRunner,
      );
      await queryRunner.commitTransaction();
      return user;
    } catch (err) {
      console.error(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getUserData(
    email: string,
    userId: number,
    myId?: number,
  ): Promise<UserData> {
    try {
      const user = await this.getUserByEmail(email);
      const followings =
        await this.followsService.getFollowingsByUserId(userId);
      const followers = await this.followsService.getFollowersByUserId(userId);
      if (!user) throw new NotFoundException();
      let result = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          userCustomId: user.user_custom_id,
        },
        followingCount: followings.length,
        followerCount: followers.length,
      };

      if (myId) {
        const myFollowings =
          await this.followsService.getFollowingsByUserId(myId);
        const isFollowingUser = Boolean(
          myFollowings.find((data) => data.userId === userId),
        );
        result = Object.assign(result, { isFollowingUser });
      }
      return result;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        '사용자 조회 중 오류가 발생했습니다.',
      );
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        where: { email },
      });
      return user;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        '사용자 조회 중 오류가 발생했습니다.',
      );
    }
  }

  async getUserByCustomId(userCustomId: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        where: { user_custom_id: userCustomId },
      });
      return user;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        '사용자 조회 중 오류가 발생했습니다.',
      );
    }
  }

  async getUserByUid(userUid: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        where: { uid: userUid },
      });
      return user;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        '사용자 조회 중 오류가 발생했습니다.',
      );
    }
  }

  async createUser({ email, name, userCustomId, password }: CreateUserDto) {
    try {
      const hash = await bcrypt.hash(password, 12);
      const user = new User();
      user.name = name;
      user.email = email;
      user.user_custom_id = userCustomId;
      user.password = hash;
      user.uid = uuid.v4();
      const result = await this.usersRepository.save(user);
      return result;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        '사용자 생성 중 오류가 발생했습니다.',
      );
    }
  }

  async createSocialUser(name: string, queryRunner: QueryRunner) {
    try {
      const user = new User();
      user.name = name;
      user.uid = uuid.v4();
      if (!queryRunner) {
        return await this.usersRepository.save(user);
      }
      return await queryRunner.manager.save(user);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        '사용자 생성 중 오류가 발생했습니다.',
      );
    }
  }

  async isEmailExist(email: string): Promise<boolean> {
    try {
      const user = await this.usersRepository.findOne({
        where: { email },
      });
      return Boolean(user);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        '이메일 존재 여부 확인 중 오류가 발생했습니다.',
      );
    }
  }

  async getSocialUserByEmail(email: string): Promise<any> {
    return await this.userSocialRepository
      .createQueryBuilder('userSocial')
      .leftJoinAndSelect('userSocial.user', 'user')
      .leftJoinAndSelect('userSocial.socials', 'social')
      .where('userSocial.email = :email', { email })
      .getOne()
      .then((userSocial) => {
        if (userSocial) {
          const { user, socials } = userSocial;
          return {
            user: {
              id: user.id,
              uid: user.uid,
              name: user.name,
              email: userSocial.email,
            },
            socialType: socials.type,
          };
        }
      });
  }

  async updateUserProfileImageId(
    id: number,
    imageId: UserProfileImage,
    queryRunner?: QueryRunner,
  ) {
    try {
      if (queryRunner) {
        await queryRunner.manager.update(
          User,
          { id },
          { user_profile_image: imageId },
        );
      } else {
        await this.usersRepository.update(
          { id },
          { user_profile_image: imageId },
        );
      }
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        '유저 정보 업데이트에 실패했습니다.',
      );
    }
  }
}
