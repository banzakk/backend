import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Whisper } from '@src/whispers/entities/whisper.entity';
import { UserWhisperController } from './user-whisper.controller';
import { UserWhisperService } from './user-whisper.service';

@Module({
  imports: [TypeOrmModule.forFeature([Whisper])],
  controllers: [UserWhisperController],
  providers: [UserWhisperService],
})
export class UserWhisperModule {}
