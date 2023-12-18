import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
    @Body(new ValidationPipe()) createHashTagDto: CreateHashTagDto,
    @UploadedFiles() image,
    @UploadedFiles() imageBuffers,
    @UploadedFiles() fileNames,
    @UploadedFiles() fileMimeTypes,
    @UploadedFiles() fileSize,
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

  @Get()
  findAll() {
    return this.whispersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.whispersService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    // 삭제할 위스퍼 아이디
    return this.whispersService.remove(+id);
  }
}
