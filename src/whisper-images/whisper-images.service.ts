import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Whisper } from '@src/whispers/entities/whisper.entity';
import { Repository } from 'typeorm';
import { CreateWhisperImageDto } from './dto/create-whisper-image.dto';
import { WhisperImage } from './entities/whisper-image.entity';

@Injectable()
export class WhisperImagesService {
  constructor(
    @InjectRepository(WhisperImage)
    private whisperImagesRepository: Repository<WhisperImage>,
  ) {}

  async createImage(
    whisperId: number,
    createWhisperImageDto: CreateWhisperImageDto,
  ) {
    const { url } = createWhisperImageDto;

    for (const imageUrl of url) {
      const whisper = await this.whisperImagesRepository.manager.findOne(
        Whisper,
        {
          where: { id: whisperId },
        },
      );

      const whisperImage = new WhisperImage();
      whisperImage.url = imageUrl;
      whisperImage.whisper = whisper;
      await this.whisperImagesRepository.save(whisperImage);
    }
    return 'Whisper image creation successful';
  }
}
