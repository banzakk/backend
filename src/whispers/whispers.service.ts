import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashTagsService } from '@src/hash-tags/hash-tags.service';
import { ImageService } from '@src/image/image.service';
import { User } from '@src/users/entities/user.entity';
import { WhisperHashTagService } from '@src/whisper-hash-tag/whisper-hash-tag.service';
import { CreateWhisperImageDto } from '@src/whisper-images/dto/create-whisper-image.dto';
import { WhisperImagesService } from '@src/whisper-images/whisper-images.service';
import { WhisperStatus } from '@src/whisper-status/entities/whisper-status.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateWhisperDto } from './dto/create-whisper.dto';
import { Whisper } from './entities/whisper.entity';

@Injectable()
export class WhispersService {
  constructor(
    @InjectRepository(Whisper) private whispersRepository: Repository<Whisper>,
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
      const whisperStatus = await this.whispersRepository.manager.findOne(
        WhisperStatus,
        {
          where: { id: 2 },
        },
      );
      const whisper = new Whisper();
      whisper.user = user;
      whisper.content = content;
      whisper.whisper_status = whisperStatus;

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
}
