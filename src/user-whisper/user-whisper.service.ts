import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from '@src/follows/entities/follow.entity';
import { FollowsService } from '@src/follows/follows.service';
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
    @InjectRepository(Follow) private followsRepository: Repository<Follow>,
    private readonly followsService: FollowsService,
  ) {}

  async viewTimeLine(
    accessUserId: number,
    userId: number,
    isUserTimeLine: boolean,
    pageNumber: number,
    limitNumber: number,
  ) {
    try {
      const result = await this.viewUserTimeLine(
        accessUserId,
        userId,
        pageNumber,
        limitNumber + 1,
      );
      let resultQuery;

      if (isUserTimeLine) {
        resultQuery = await result.getRawMany();
      } else {
        const findFollowingUser =
          await this.followsService.findFollowingUserId(accessUserId);
        findFollowingUser.push(accessUserId);

        resultQuery = await result
          .leftJoin(
            Follow,
            'follows',
            'follows.following_user_id IN (:...findFollowingUser)',
            { findFollowingUser },
          )
          .where('users.id = :id OR users.id IN (:...findFollowingUser)', {
            id: userId,
            findFollowingUser,
          })
          .getRawMany();
      }

      return {
        currentPage: pageNumber,
        data: resultQuery.map((row) => ({
          whisperId: row.whisperId,
          content: row.content,
          userId: row.userId,
          nickName: row.nickName,
          hashTag: JSON.parse(row.hashTag),
          imageUrl: JSON.parse(row.imageUrl),
          isMyWhisper: row.isMyWhisper,
        })),
      };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('타임라인 조회에 실패하였습니다.');
    }
  }

  private async viewUserTimeLine(
    accessUserId: number,
    userId: number,
    pageNumber: number,
    limitNumber: number,
  ) {
    try {
      const startPosition = (pageNumber - 1) * limitNumber;

      return await this.whispersRepository
        .createQueryBuilder('whispers')
        .select([
          'whispers.id AS whisperId',
          'whispers.content AS content',
          'users.id AS userId',
          'users.name AS nickName',
          '(CASE WHEN COUNT(hash_tags.name) > 0 THEN JSON_ARRAYAGG(hash_tags.name) ELSE "[]" END) AS hashTag',
          '(CASE WHEN COUNT(whisper_images.url) > 0 THEN JSON_ARRAYAGG(whisper_images.url) ELSE "[]" END) AS imageUrl',
          '(CASE WHEN users.id = :accessUserId THEN 1 ELSE 0 END) AS isMyWhisper',
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
        .andWhere('whispers.whisper_status_id = :notDeletedSatusId', {
          notDeletedSatusId: 2,
        })
        .groupBy('whispers.id')
        .orderBy('whispers.created_at', 'DESC')
        .offset(startPosition)
        .limit(limitNumber)
        .setParameter('accessUserId', accessUserId);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        '유저 타임라인 조회에 실패하였습니다.',
      );
    }
  }
}
