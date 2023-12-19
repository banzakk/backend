import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashTags } from '@src/hash-tags/entities/hash-tag.entity';
import { Whisper } from '@src/whispers/entities/whisper.entity';
import { WhisperHashTag } from './entities/whisper-hash-tag.entity';
import { WhisperHashTagService } from './whisper-hash-tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([WhisperHashTag, Whisper, HashTags])],
  providers: [WhisperHashTagService],
  exports: [WhisperHashTagService],
})
export class WhisperHashTagModule {}
