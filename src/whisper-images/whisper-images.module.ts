import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhisperImage } from './entities/whisper-image.entity';
import { WhisperImagesService } from './whisper-images.service';

@Module({
  imports: [TypeOrmModule.forFeature([WhisperImage])],
  providers: [WhisperImagesService],
  exports: [WhisperImagesService],
})
export class WhisperImagesModule {}
