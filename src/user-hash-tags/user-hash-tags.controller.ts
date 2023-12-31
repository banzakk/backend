import { Body, Controller, Post, Request } from '@nestjs/common';
import { CreateUserHashTagDto } from './dto/create-user-hash-tag.dto';
import { UserHashTagsService } from './user-hash-tags.service';

@Controller('/users/hash-tags')
export class UserHashTagsController {
  constructor(private readonly userHashTagsService: UserHashTagsService) {}

  @Post()
  async create(
    @Request() req,
    @Body() createUserHashTagDto: CreateUserHashTagDto,
  ) {
    const { email } = req.user;
    await this.userHashTagsService.addHashTag(createUserHashTagDto, email);
    return { message: '해시태그가 추가되었습니다.' };
  }
}
