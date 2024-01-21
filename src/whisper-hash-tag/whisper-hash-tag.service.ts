import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
    try {
      const whisper = await this.whispersRepository.findOne({
        where: { id: whisperId },
      });

      if (!whisper) {
        throw new InternalServerErrorException(
          `위스퍼 아이디 ${whisperId}를(을) 찾을 수 없습니다.`,
        );
      }

      for (const hashTag of hashTagId) {
        const hashTagIdNumber = await this.hashTagsRepository.findOne({
          where: { id: hashTag },
        });

        if (!hashTagIdNumber) {
          throw new InternalServerErrorException(
            `해시태그 아이디 ${hashTag}를(을) 찾을 수 없습니다.`,
          );
        }

        const whisperHashTag = new WhisperHashTag();
        whisperHashTag.whisper = whisper;
        whisperHashTag.hash_tag = hashTagIdNumber;
        await this.whisperHashTagRepository.save(whisperHashTag);
      }

      return '위스퍼 해시태그가 생성되었습니다.';
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        `위스퍼 해시태그 생성에 실패하였습니다.`,
      );
    }
  }
}
