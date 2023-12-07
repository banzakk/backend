import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Whisper } from './entities/whisper.entity';
import { WhispersController } from './whispers.controller';
import { WhispersService } from './whispers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Whisper])],
  controllers: [WhispersController],
  providers: [WhispersService],
})
export class WhispersModule {}
