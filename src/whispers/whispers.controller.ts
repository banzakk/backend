import {
  Body,
  Controller,
  Post,
  Request,
  UploadedFiles,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateHashTagDto } from '@src/hash-tags/dto/create-hash-tag.dto';
import { CreateWhisperDto } from './dto/create-whisper.dto';
import { WhispersService } from './whispers.service';

@Controller('whispers')
export class WhispersController {
  constructor(private readonly whispersService: WhispersService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('image', 4))
  async create(
    @Request() req,
    @Body(new ValidationPipe()) createWhisperDto: CreateWhisperDto,
    @UploadedFiles() image,
    @UploadedFiles() imageBuffers,
    @UploadedFiles() fileNames,
    @UploadedFiles() fileMimeTypes,
    @UploadedFiles() fileSize,
    @Body(new ValidationPipe()) createHashTagDto?: CreateHashTagDto,
  ) {
    return await this.whispersService.createWhisper(
      req.user.userId,
      createWhisperDto,
      createHashTagDto,
      image,
      imageBuffers,
      fileNames,
      fileMimeTypes,
      fileSize,
    );
  }
}
