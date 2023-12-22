import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashTagStatus } from '@src/hash-tag-status/entities/hash-tag-status.entity';
import { HashTagsModule } from '@src/hash-tags/hash-tags.module';
import { ImageModule } from '@src/image/image.module';
import { WhisperHashTagModule } from '@src/whisper-hash-tag/whisper-hash-tag.module';
import { WhisperImage } from '@src/whisper-images/entities/whisper-image.entity';
import { WhisperImagesModule } from '@src/whisper-images/whisper-images.module';
import { Whisper } from './entities/whisper.entity';
import { WhispersController } from './whispers.controller';
import { WhispersService } from './whispers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Whisper, WhisperImage, HashTagStatus]),
    WhisperImagesModule,
    HashTagsModule,
    WhisperHashTagModule,
    ImageModule,
  ],
  controllers: [WhispersController],
  providers: [WhispersService],
})
export class WhispersModule {}
