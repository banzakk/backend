import { Controller, Get, Param, Request } from '@nestjs/common';
import { UserWhisperService } from './user-whisper.service';

@Controller('users')
export class UserWhisperController {
  constructor(private readonly userWhisperService: UserWhisperService) {}

  @Get(':id/whispers')
  async findOne(@Param('id') id: number, @Request() req) {
    const isUserTimeLine: boolean = true;
    return await this.userWhisperService.viewTimeLine(
      req.user.userId,
      id,
      isUserTimeLine,
    );
  }
}
