import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashTagStatus } from '@src/hash-tag-status/entities/hash-tag-status.entity';
import { HashTags } from '@src/hash-tags/entities/hash-tag.entity';
import { HashTagsModule } from '@src/hash-tags/hash-tags.module';
import { ImageModule } from '@src/image/image.module';
import { LikeModule } from '@src/like/like.module';
import { WhisperHashTagModule } from '@src/whisper-hash-tag/whisper-hash-tag.module';
import { WhisperImage } from '@src/whisper-images/entities/whisper-image.entity';
import { WhisperImagesModule } from '@src/whisper-images/whisper-images.module';
import { WhisperStatus } from '@src/whisper-status/entities/whisper-status.entity';
import { Whisper } from './entities/whisper.entity';
import { WhispersController } from './whispers.controller';
import { WhispersService } from './whispers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Whisper,
      WhisperImage,
      HashTags,
      HashTagStatus,
      WhisperStatus,
    ]),
    WhisperImagesModule,
    HashTagsModule,
    WhisperHashTagModule,
    ImageModule,
    forwardRef(() => LikeModule),
  ],
  controllers: [WhispersController],
  providers: [WhispersService],
  exports: [WhispersService],
})
export class WhispersModule {}
