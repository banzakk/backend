import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@src/models';
import * as bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';
import * as uuid from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}
  async signup(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const userExist = await this.isEmailExist(email);
    if (userExist) {
      throw new BadRequestException('해당 email로는 가입할 수 없습니다.');
    }
    await this.createUser(createUserDto);
  }

  private async createUser({
    email,
    name,
    user_custom_id,
    password,
  }: CreateUserDto) {
    const hash = await bcrypt.hash(password, 12);
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = new User();
      user.name = name;
      user.email = email;
      user.user_custom_id = user_custom_id;
      user.password = hash;
      user.uid = uuid.v4();
      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
  private async isEmailExist(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    return Boolean(user);
  }
}
