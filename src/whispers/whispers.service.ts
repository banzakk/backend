import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@src/models/user.entity';
import { S3 } from 'aws-sdk';
import { Repository } from 'typeorm';
import { CreateWhisperDto } from './dto/create-whisper.dto';
import { Whisper } from './entities/whisper.entity';

interface UserDetails {
  email: string;
  userId: number;
  userUid: string;
}

@Injectable()
export class WhispersService {
  constructor(
    @Inject('S3_INSTANCE') private readonly s3: S3,
    @InjectRepository(Whisper) private whispersRepository: Repository<Whisper>,
  ) {}

  async create(
    user: UserDetails,
    createWhisperDto: CreateWhisperDto,
    image,
    imageBuffers,
    fileNames,
    fileMimeTypes,
    fileSize,
  ) {
    const { content } = createWhisperDto;
    return await this.saveWhisper(
      user.userId,
      content,
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

      if (image && image.length > 0) {
        const imageObjects = image.map((image, index) => ({
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
        const imageUrl = await Promise.all(uploadPromises);
        await this.whispersRepository.save(whisper);

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
}
