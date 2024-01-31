import {
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashTags } from '@src/hash-tags/entities/hash-tag.entity';
import { HashTagsService } from '@src/hash-tags/hash-tags.service';
import { ImageService } from '@src/image/image.service';
import { Like } from '@src/like/entities/like.entity';
import { LikeService } from '@src/like/like.service';
import { User } from '@src/users/entities/user.entity';
import { WhisperDeletedStatus } from '@src/whisper-deleted-status/entities/whisper-deleted-status.entity';
import { WhisperHashTag } from '@src/whisper-hash-tag/entities/whisper-hash-tag.entity';
import { WhisperHashTagService } from '@src/whisper-hash-tag/whisper-hash-tag.service';
import { CreateWhisperImageDto } from '@src/whisper-images/dto/create-whisper-image.dto';
import { WhisperImage } from '@src/whisper-images/entities/whisper-image.entity';
import { WhisperImagesService } from '@src/whisper-images/whisper-images.service';
import { DataSource, Repository } from 'typeorm';
import { Whisper } from './entities/whisper.entity';

@Injectable()
export class WhispersService {
  constructor(
    @InjectRepository(Whisper) private whispersRepository: Repository<Whisper>,
    @InjectRepository(WhisperDeletedStatus)
    private whisperStatusRepository: Repository<WhisperDeletedStatus>,
    private readonly hashTagsService: HashTagsService,
    private readonly whisperImagesService: WhisperImagesService,
    private readonly whisperHashTagService: WhisperHashTagService,
    private readonly imageService: ImageService,
    @Inject(forwardRef(() => LikeService))
    private readonly likeService: LikeService,
    private dataSource: DataSource,
  ) {}

  async createWhisper(
    userId: number,
    createWhisperDto,
    image,
    imageBuffers,
    fileNames,
    fileMimeTypes,
    fileSize,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { content, hashTag } = createWhisperDto;
      const user = await this.whispersRepository.manager.findOne(User, {
        where: { id: userId },
      });
      const whisperDeletedStatus =
        await this.whispersRepository.manager.findOne(WhisperDeletedStatus, {
          where: { id: 2 },
        });
      const whisper = new Whisper();
      whisper.user = user;
      whisper.content = content;
      whisper.whisper_deleted_status = whisperDeletedStatus;

      const path: string = 'whisper_images';

      if (image && image.length > 0) {
        const imageUrl = await this.imageService.createImage(
          image,
          imageBuffers,
          fileNames,
          fileMimeTypes,
          fileSize,
          path,
        );
        const imageUrlDto: CreateWhisperImageDto = { url: imageUrl };
        await this.whispersRepository.save(whisper);
        await this.whisperImagesService.createImage(whisper.id, imageUrlDto);
      }
      await this.whispersRepository.save(whisper);

      const hashTagArray = Array.isArray(hashTag) ? hashTag : [hashTag];

      if (hashTag !== undefined && (hashTag || hashTagArray.length > 0)) {
        const hashTagIdArr: number[] | undefined =
          await this.hashTagsService.createHashTag(hashTagArray);

        if (hashTagIdArr !== undefined) {
          await this.whisperHashTagService.createWhisperHashTag(
            whisper.id,
            hashTagIdArr,
          );
        }
      }
      await queryRunner.commitTransaction();
      return {
        message: 'Whisper creation successful',
      };
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('위스퍼 작성에 실패하였습니다.');
    } finally {
      await queryRunner.release();
    }
  }

  async deleteWhisper(userId: number, whisperId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const [whisperDeletedStatus] = await this.whispersRepository
        .createQueryBuilder('whispers')
        .select('whispers.whisper_deleted_status_id')
        .where('whispers.id = :id', { id: whisperId })
        .andWhere('whispers.user_id = :userId', { userId })
        .getRawMany();

      if (whisperDeletedStatus.whisper_deleted_status === 2) {
        const foundDeleteWhisperStatus =
          await this.whisperStatusRepository.findOne({
            where: { id: 1 },
          });

        await this.whispersRepository
          .createQueryBuilder('whispers')
          .where('whispers.id = :id', { id: whisperId })
          .andWhere('whispers.user_id = :userId', { userId })
          .update({ whisper_deleted_status: foundDeleteWhisperStatus })
          .execute();

        await queryRunner.commitTransaction();
        return { message: '위스퍼 삭제를 성공하였습니다.' };
      } else {
        throw new InternalServerErrorException('이미 삭제된 위스퍼 입니다.');
      }
    } catch (err) {
      console.error(err);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('위스퍼 삭제 중 실패하였습니다.');
    } finally {
      await queryRunner.release();
    }
  }

  async findWhisper(whisperId: number) {
    try {
      return await this.whispersRepository.findOne({
        where: { id: whisperId },
      });
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('위스퍼를 찾는데 실패하였습니다.');
    }
  }

  async likeWhisper(userId: number, whisperId: number) {
    try {
      return await this.likeService.createLike(userId, whisperId);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('좋아요를 실패했습니다.');
    }
  }

  async deleteLikeWhisper(userId: number, whisperId: number) {
    try {
      return await this.likeService.deleteLike(userId, whisperId);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('좋아요 해제를 실패했습니다.');
    }
  }

  async viewWhisperDetail(userId: number, whisperId: number) {
    try {
      const query = await this.whispersRepository
        .createQueryBuilder('whispers')
        .select([
          'whispers.id AS whisperId',
          'whispers.content AS content',
          'users.id AS userId',
          'users.name AS nickName',
          '(CASE WHEN COUNT(hash_tags.name) > 0 THEN JSON_ARRAYAGG(hash_tags.name) ELSE "[]" END) AS hashTag',
          '(CASE WHEN COUNT(whisper_images.url) > 0 THEN JSON_ARRAYAGG(whisper_images.url) ELSE "[]" END) AS imageUrl',
          '(CASE WHEN users.id = :accessUserId THEN 1 ELSE 0 END) AS isMyWhisper',
          '(CASE WHEN likes.user_id IS NOT NULL THEN 1 ELSE 0 END) AS liked',
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
        .leftJoin(
          Like,
          'likes',
          'likes.user_id = :accessUserId AND likes.whisper_id = :whisperId',
        )
        .where('whispers.id = :whisperId', { whisperId: whisperId })
        .setParameter('accessUserId', userId)
        .getRawMany();

      return query.map((row) => ({
        whisperId: row.whisperId,
        content: row.content,
        userId: row.userId,
        nickName: row.nickName,
        hashTag: JSON.parse(row.hashTag),
        imageUrl: JSON.parse(row.imageUrl),
        isMyWhisper: row.isMyWhisper,
        liked: row.liked,
      }));
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        '위스퍼를 불러오는데 실패했습니다.',
      );
    }
  }
}
