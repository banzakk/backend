import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashTagsService } from '@src/hash-tags/hash-tags.service';
import { User } from '@src/users/entities/user.entity';
import { WhisperHashTagService } from '@src/whisper-hash-tag/whisper-hash-tag.service';
import { CreateWhisperImageDto } from '@src/whisper-images/dto/create-whisper-image.dto';
import { WhisperImagesService } from '@src/whisper-images/whisper-images.service';
import { S3 } from 'aws-sdk';
import { DataSource, Repository } from 'typeorm';
import { CreateWhisperDto } from './dto/create-whisper.dto';
import { Whisper } from './entities/whisper.entity';

@Injectable()
export class WhispersService {
  constructor(
    @Inject('S3_INSTANCE') private readonly s3: S3,
    @InjectRepository(Whisper) private whispersRepository: Repository<Whisper>,
    private readonly hashTagsService: HashTagsService,
    private readonly whisperImagesService: WhisperImagesService,
    private readonly whisperHashTagService: WhisperHashTagService,
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
      const whisper = new Whisper();
      whisper.user = user;
      whisper.content = content;

      if (image && image.length > 0) {
        const imageObjects = image.map((image, index: number) => ({
          buffer: imageBuffers[index].buffer,
          originalname: fileNames[index].originalname,
          mimeType: fileMimeTypes[index].mimetype,
          size: fileSize[index].size,
        }));

        const uploadPromises = imageObjects.map(async (imageObject) => {
          const key = `whisper_images/${Date.now()}_${
            imageObject.originalname
          }`;
          const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: imageObject.buffer,
            ACL: 'private',
            ContentType: imageObject.mimeType,
          };

          const result = await this.s3.upload(params).promise();
          return result.Location;
        });
        const imageUrl: string[] = await Promise.all(uploadPromises);
        const imageUrlDto: CreateWhisperImageDto = { url: imageUrl };
        await this.whispersRepository.save(whisper);
        await this.whisperImagesService.createImage(whisper.id, imageUrlDto);

        return {
          imageUrl: imageUrl,
          message: 'Whisper creation successful',
        };
      }
      await this.whispersRepository.save(whisper);

      const hashTagArray = Array.isArray(hashTag) ? hashTag : [hashTag];

      if (hashTag !== undefined && (hashTag || hashTagArray.length > 0)) {
        let hashTagIdArr: number[] | undefined;

        if (hashTagIdArr !== undefined) {
          hashTagIdArr = await this.hashTagsService.createHashTag(hashTagArray);
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
