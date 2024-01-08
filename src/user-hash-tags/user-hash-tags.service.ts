import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashTagsService } from '@src/hash-tags/hash-tags.service';
import { UserHashTag } from '@src/user-hash-tags/entities/user-hash-tag.entity';
import { UsersService } from '@src/users/users.service';
import { Repository } from 'typeorm';
import { CreateUserHashTagDto } from './dto/create-user-hash-tag.dto';

@Injectable()
export class UserHashTagsService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(UserHashTag)
    private userHashTagRepository: Repository<UserHashTag>,
    private hashTagsService: HashTagsService,
  ) {}
  async addHashTag(createUserHashTagDto: CreateUserHashTagDto, email: string) {
    const { hashTags } = createUserHashTagDto;
    const user = await this.usersService.getUserByEmail(email);
    if (user && user.id && hashTags && hashTags.length > 0) {
      const hashTagData = await this.hashTagsService.getHashTagByName(hashTags);
      const hashTagIds = hashTagData.map((data) => data.id);
      await this.addUserHashTag(user.id, hashTagIds);
    }
  }

  private async addUserHashTag(userId: number, hashTags: any) {
    try {
      const hashes = hashTags.map((id) => ({
        user: userId,
        hash_tag: id,
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
