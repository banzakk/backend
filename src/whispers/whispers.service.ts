import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashTagStatus } from '@src/hash-tag-status/entities/hash-tag-status.entity';
import { CreateHashTagDto } from '@src/hash-tags/dto/create-hash-tag.dto';
import { HashTags } from '@src/hash-tags/entities/hash-tag.entity';
import { User } from '@src/users/entities/user.entity';
import { CreateWhisperImageDto } from '@src/whisper-images/dto/create-whisper-image.dto';
import { WhisperImagesService } from '@src/whisper-images/whisper-images.service';
import { S3 } from 'aws-sdk';
import { Repository } from 'typeorm';
import { CreateWhisperDto } from './dto/create-whisper.dto';
import { Whisper } from './entities/whisper.entity';

@Injectable()
export class WhispersService {
  constructor(
    @Inject('S3_INSTANCE') private readonly s3: S3,
    @InjectRepository(Whisper) private whispersRepository: Repository<Whisper>,
    @InjectRepository(HashTags)
    private HashTagsRepository: Repository<HashTags>,
    @InjectRepository(HashTagStatus)
    private HashTagStatusRepository: Repository<HashTagStatus>,
    private readonly whisperImagesService: WhisperImagesService,
  ) {}

  async createWhisper(
    userId: number,
    createWhisperDto: CreateWhisperDto,
    createHashTagDto: CreateHashTagDto,
    image,
    imageBuffers,
    fileNames,
    fileMimeTypes,
    fileSize,
  ) {
    const { content } = createWhisperDto;
    const { hashTag } = createHashTagDto;
    return await this.saveWhisper(
      userId,
      content,
      hashTag,
      image,
      imageBuffers,
      fileNames,
      fileMimeTypes,
      fileSize,
    );
  }

  private async saveWhisper(
    userId: number,
    content: string,
    hashTag: string,
    image,
    imageBuffers,
    fileNames,
    fileMimeTypes,
    fileSize,
  ) {
    try {
      const user = await this.whispersRepository.manager.findOne(User, {
        where: { id: userId },
      });
      const whisper = new Whisper();
      whisper.user = user;
      whisper.content = content;

      if (hashTag && Array.isArray(hashTag) && hashTag.length > 0) {
        const userStatus = await this.HashTagStatusRepository.findOne({
          where: { id: 2 },
        });
        for (const tag of hashTag) {
          const hashTags = new HashTags();
          hashTags.name = tag;
          hashTags.hash_tag_status = userStatus;
          await this.HashTagsRepository.save(hashTags);
        }
      }

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
      return 'Whisper creation successful';
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('위스퍼 작성에 실패하였습니다.');
    }
  }

  findAll() {
    return `This action returns all whispers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} whisper`;
  }

  remove(id: number) {
    return `This action removes a #${id} whisper`;
  }
}
