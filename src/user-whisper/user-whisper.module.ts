import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from '@src/follows/entities/follow.entity';
import { FollowsModule } from '@src/follows/follows.module';
import { Whisper } from '@src/whispers/entities/whisper.entity';
import { UserWhisperController } from './user-whisper.controller';
import { UserWhisperService } from './user-whisper.service';

@Module({
  imports: [TypeOrmModule.forFeature([Whisper, Follow]), FollowsModule],
  controllers: [UserWhisperController],
  providers: [UserWhisperService],
})
export class UserWhisperModule {}
