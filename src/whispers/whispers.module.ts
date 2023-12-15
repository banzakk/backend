import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhisperImage } from '@src/whisper-images/entities/whisper-image.entity';
import { WhisperImagesModule } from '@src/whisper-images/whisper-images.module';
import { Whisper } from './entities/whisper.entity';
import { WhispersController } from './whispers.controller';
import { WhispersService } from './whispers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Whisper, WhisperImage]),
    WhisperImagesModule,
  ],
  controllers: [WhispersController],
  providers: [WhispersService],
})
export class WhispersModule {}
