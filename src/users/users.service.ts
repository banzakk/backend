import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthType } from '@src/auth/types/auth-type';
import { UserHashTag } from '@src/models';
import { SocialsService } from '@src/socials/socials.service';
import { UserSocial } from '@src/user-socials/entities/user-social.entity';
import { UserSocialsService } from '@src/user-socials/user-socials.service';
import { User } from '@src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import * as uuid from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(UserHashTag)
    private userHashTagRepository: Repository<UserHashTag>,
    @InjectRepository(UserSocial)
    private userSocialRepository: Repository<UserSocial>,
    private readonly socialsService: SocialsService,
    private readonly userSocialsService: UserSocialsService,
    private dataSource: DataSource,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const { email, hashTags } = createUserDto;
    const userExist = await this.isEmailExist(email);
    if (userExist) {
      throw new BadRequestException('해당 email로는 가입할 수 없습니다.');
    }
    await this.createUser(createUserDto);
    const user = await this.getUserByEmail(email);
    if (user && user.id && hashTags && hashTags.length > 0)
      await this.addUserHashTag(user.id, hashTags);
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

  async createUser({ email, name, user_custom_id, password }: CreateUserDto) {
    try {
      const hash = await bcrypt.hash(password, 12);
      const user = new User();
      user.name = name;
      user.email = email;
      user.user_custom_id = user_custom_id;
      user.password = hash;
      user.uid = uuid.v4();
      await this.usersRepository.save(user);
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

  async getSocialUserByEmail(email: string): Promise<User | undefined> {
    return await this.userSocialRepository
      .createQueryBuilder('userSocial')
      .leftJoinAndSelect('userSocial.user', 'user')
      .where('userSocial.email = :email', { email })
      .getOne()
      .then((userSocial) => userSocial?.user);
  }

  private async addUserHashTag(userId: number, hashTags: any) {
    try {
      const hashes = hashTags.map((data) => ({
        user: userId,
        hash_tag: data,
      }));
      const userHashTags = await this.userHashTagRepository.create(hashes);
      await this.userHashTagRepository.save(userHashTags);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        '해시태그 추가 중 오류가 발생했습니다.',
      );
    }
  }
}
