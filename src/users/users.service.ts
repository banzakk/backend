import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserHashTag } from '@src/models';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import * as uuid from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(UserHashTag)
    private userHashTagRepository: Repository<UserHashTag>,
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
  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        where: { email },
      });
      if (!user)
        throw new NotFoundException(
          `이메일이 ${email}인 사용자를 찾을 수 없습니다.`,
        );
      return user;
    } catch (err) {
      console.error(err);
      if (err instanceof NotFoundException) {
        throw err;
      }
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
      if (!user) throw new NotFoundException(`사용자를 찾을 수 없습니다.`);
      return user;
    } catch (err) {
      console.error(err);
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException(
        '사용자 조회 중 오류가 발생했습니다.',
      );
    }
  }
  private async createUser({
    email,
    name,
    user_custom_id,
    password,
  }: CreateUserDto) {
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
  private async isEmailExist(email: string) {
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
