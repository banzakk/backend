import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashTags } from '@src/hash-tags/entities/hash-tag.entity';
import { User } from '@src/users/entities/user.entity';
import { WhisperHashTag } from '@src/whisper-hash-tag/entities/whisper-hash-tag.entity';
import { WhisperImage } from '@src/whisper-images/entities/whisper-image.entity';
import { Whisper } from '@src/whispers/entities/whisper.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserWhisperService {
  constructor(
    @InjectRepository(Whisper) private whispersRepository: Repository<Whisper>,
  ) {}

  async viewTimeLine(
    accessUserId: number,
    userId: number,
    isUserTimeLine: boolean,
  ) {
    return isUserTimeLine
      ? await this.viewUserTimeLine(accessUserId, userId)
      : await this.viewMyTimeLine();
  }

  private async viewUserTimeLine(accessUserId: number, userId: number) {
    try {
      const result = await this.whispersRepository
        .createQueryBuilder('whispers')
        .select([
          'whispers.id AS whisperId',
          'whispers.content AS content',
          'users.id AS userId',
          'users.name AS nickName',
          '(CASE WHEN COUNT(hash_tags.name) > 0 THEN JSON_ARRAYAGG(hash_tags.name) ELSE "[]" END) AS hashTag',
          '(CASE WHEN COUNT(whisper_images.url) > 0 THEN JSON_ARRAYAGG(whisper_images.url) ELSE "[]" END) AS imageUrl',
          '(CASE WHEN users.id = :accessUserId THEN 1 ELSE 0 END) AS isMyPost',
        ])
        .leftJoin(User, 'users', 'whispers.user_id = users.id')
        .leftJoin(
          WhisperHashTag,
          'whisper_hash_tags',
          'whispers.id = whisper_hash_tags.whisper_id',
        )
        .leftJoin(
          HashTags,
          'hash_tags',
          'whisper_hash_tags.hash_tag_id = hash_tags.id',
        )
        .leftJoin(
          WhisperImage,
          'whisper_images',
          'whispers.id = whisper_images.whisper_id',
        )
        .where('users.id = :id', { id: userId })
        .groupBy('whispers.id')
        .orderBy('whispers.created_at', 'DESC')
        .setParameter('accessUserId', accessUserId)
        .getRawMany();

      const parsedResult = result.map((row) => {
        return {
          whisperId: row.whisperId,
          content: row.content,
          userId: row.userId,
          nickName: row.nickName,
          hashTag: JSON.parse(row.hashTag),
          imageUrl: JSON.parse(row.imageUrl),
          isMyPost: row.isMyPost,
        };
      });

      return parsedResult;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        '유저 타임라인 조회에 실패하였습니다.',
      );
    }
  }

  private async viewMyTimeLine() {
    try {
      return console.log('내 타임라인 조회');
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        '내 타임라인 조회에 실패하였습니다.',
      );
    }
  }
}
