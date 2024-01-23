import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Request,
  UploadedFiles,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
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
  ) {
    return await this.whispersService.createWhisper(
      req.user.userId,
      createWhisperDto,
      image,
      imageBuffers,
      fileNames,
      fileMimeTypes,
      fileSize,
    );
  }

  @Patch(':whisperId')
  async DeletedWhisper(@Request() req, @Param('whisperId') whisperId: number) {
    return await this.whispersService.deleteWhisper(req.user.userId, whisperId);
  }
}
