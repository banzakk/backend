import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashTags } from '@src/hash-tags/entities/hash-tag.entity';
import { HashTagsService } from '@src/hash-tags/hash-tags.service';
import { ImageService } from '@src/image/image.service';
import { User } from '@src/users/entities/user.entity';
import { WhisperHashTag } from '@src/whisper-hash-tag/entities/whisper-hash-tag.entity';
import { WhisperHashTagService } from '@src/whisper-hash-tag/whisper-hash-tag.service';
import { CreateWhisperImageDto } from '@src/whisper-images/dto/create-whisper-image.dto';
import { WhisperImage } from '@src/whisper-images/entities/whisper-image.entity';
import { WhisperImagesService } from '@src/whisper-images/whisper-images.service';
import { DataSource, Repository } from 'typeorm';
import { CreateWhisperDto } from './dto/create-whisper.dto';
import { Whisper } from './entities/whisper.entity';

@Injectable()
export class WhispersService {
  constructor(
    @InjectRepository(Whisper) private whispersRepository: Repository<Whisper>,
    @InjectRepository(HashTags)
    private HashTagsRepository: Repository<HashTags>,
    private readonly hashTagsService: HashTagsService,
    private readonly whisperImagesService: WhisperImagesService,
    private readonly whisperHashTagService: WhisperHashTagService,
    private readonly imageService: ImageService,
    private dataSource: DataSource,
  ) {}

  async createWhisper(
    userId: number,
    createWhisperDto: CreateWhisperDto,
    image,
    imageBuffers,
    fileNames,
    fileMimeTypes,
    fileSize,
  ) {
    return await this.saveWhisper(
      userId,
      createWhisperDto,
      image,
      imageBuffers,
      fileNames,
      fileMimeTypes,
      fileSize,
    );
  }

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
        .orderBy('entity.createdAt', 'DESC')
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

  private async saveWhisper(
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
      const whisper = new Whisper();
      whisper.user = user;
      whisper.content = content;

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

        return {
          message: 'Whisper creation successful',
        };
      }
      await this.whispersRepository.save(whisper);

      const hashTagArray = Array.isArray(hashTag) ? hashTag : [hashTag];

      if (hashTag !== undefined && (hashTag || hashTagArray.length > 0)) {
        let hashTagIdArr: number[] | undefined;
        hashTagIdArr = await this.hashTagsService.createHashTag(hashTagArray);

        if (hashTagIdArr !== undefined) {
          await this.whisperHashTagService.createWhisperHashTag(
            whisper.id,
            hashTagIdArr,
          );
        }
      }
      await queryRunner.commitTransaction();
      return 'Whisper creation successful';
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('위스퍼 작성에 실패하였습니다.');
    } finally {
      await queryRunner.release();
    }
  }
}
