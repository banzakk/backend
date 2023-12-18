import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashTagStatus } from '@src/hash-tag-status/entities/hash-tag-status.entity';
import { Repository } from 'typeorm';
import { UpdateHashTagDto } from './dto/update-hash-tag.dto';
import { HashTags } from './entities/hash-tag.entity';

@Injectable()
export class HashTagsService {
  constructor(
    @InjectRepository(HashTags)
    private readonly hashTagRepository: Repository<HashTags>,
    @InjectRepository(HashTagStatus)
    private readonly HashTagStatusRepository: Repository<HashTagStatus>,
  ) {}

  async createHashTag(hashTag) {
    const statusId: number = 2;
    await this.createWhisperHashTag(hashTag, statusId);
  }

  async createWhisperHashTag(hashTag, statusId) {
    const userStatus = await this.HashTagStatusRepository.findOne({
      where: { id: statusId },
    });
    for (const tag of hashTag) {
      const hashTags = new HashTags();
      hashTags.name = tag;
      hashTags.hash_tag_status = userStatus;
      await this.hashTagRepository.save(hashTags);
    }
    return console.log('Hashtag saved successfully');
  }

  findAll() {
    return `This action returns all hashTags`;
  }

  findOne(id: number) {
    return `This action returns a #${id} hashTag`;
  }

  update(id: number, updateHashTagDto: UpdateHashTagDto) {
    return `This action updates a #${id} hashTag`;
  }

  remove(id: number) {
    return `This action removes a #${id} hashTag`;
  }
}
