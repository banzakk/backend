import { Controller, Get, Param, Query, Request } from '@nestjs/common';
import { UserWhisperService } from './user-whisper.service';

@Controller('users')
export class UserWhisperController {
  constructor(private readonly userWhisperService: UserWhisperService) {}

  @Get(':id/whispers')
  async findAllUserWhispers(
    @Param('id') id: number,
    @Request() req,
    @Query('page') pageNumber: number,
    @Query('limit') limitNumber: number,
  ) {
    const isUserTimeLine: boolean = true;
    return await this.userWhisperService.viewTimeLine(
      req.user.userId,
      id,
      isUserTimeLine,
      pageNumber,
      limitNumber,
    );
  }

  @Get(':id/timeline')
  async findAllTimeline(
    @Param('id') id: number,
    @Request() req,
    @Query('page') pageNumber: number,
    @Query('limit') limitNumber: number,
  ) {
    const isUserTimeLine: boolean = false;
    return await this.userWhisperService.viewTimeLine(
      req.user.userId,
      id,
      isUserTimeLine,
      pageNumber,
      limitNumber,
    );
  }
}
