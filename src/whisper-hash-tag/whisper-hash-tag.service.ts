import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashTags } from '@src/hash-tags/entities/hash-tag.entity';
import { Whisper } from '@src/whispers/entities/whisper.entity';
import { Repository } from 'typeorm';
import { WhisperHashTag } from './entities/whisper-hash-tag.entity';

@Injectable()
export class WhisperHashTagService {
  constructor(
    @InjectRepository(WhisperHashTag)
    private whisperHashTagRepository: Repository<WhisperHashTag>,
    @InjectRepository(Whisper) private whispersRepository: Repository<Whisper>,
    @InjectRepository(HashTags)
    private hashTagsRepository: Repository<HashTags>,
  ) {}

  async createWhisperHashTag(whisperId: number, hashTagId: number[]) {
    console.log(whisperId, hashTagId);

    const whisperIdNumber = await this.whispersRepository.manager.findOne(
      Whisper,
      {
        where: { id: whisperId },
      },
    );

    for (const hashTag of hashTagId) {
      const hashTagIdNumber = await this.hashTagsRepository.manager.findOne(
        HashTags,
        {
          where: { id: hashTag },
        },
      );

      const whisperHashTag = new WhisperHashTag();
      whisperHashTag.whisper = whisperIdNumber;
      whisperHashTag.hash_tag = hashTagIdNumber;
      await this.whisperHashTagRepository.save(whisperHashTag);
    }

    return 'This action adds a new whisperHashTag';
  }
}
