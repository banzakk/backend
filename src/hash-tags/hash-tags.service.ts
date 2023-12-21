import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashTagStatus } from '@src/hash-tag-status/entities/hash-tag-status.entity';
import { In, Repository } from 'typeorm';
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
    return await this.createWhisperHashTag(hashTag, statusId);
  }

  async createWhisperHashTag(hashTag, statusId) {
    const userStatus = await this.HashTagStatusRepository.findOne({
      where: { id: statusId },
    });

    const hashTagArr: number[] = [];
    for (const tag of hashTag) {
      const hashTags = new HashTags();
      hashTags.name = tag;
      hashTags.hash_tag_status = userStatus;
      const createHashTags: HashTags =
        await this.hashTagRepository.save(hashTags);
      hashTagArr.push(createHashTags.id);
    }
    return hashTagArr;
  }

  async getHashTagByName(names) {
    const hashTags = await this.hashTagRepository.find({
      where: {
        name: In(names),
      },
    });
    return hashTags;
  }
}
