import { Controller, Get, Param, Post, Request } from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { FollowsService } from './follows.service';

@Controller('/users/follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post(':id')
  async create(@Request() req, @Param() createFollowDto: CreateFollowDto) {
    const { userId } = req.user;
    await this.followsService.addFollow(createFollowDto, userId);
    return { message: '팔로우 신청에 성공했습니다.' };
  }

  @Get('/followers')
  async followers(@Request() req) {
    const { userId } = req.user;
    const data = await this.followsService.getFollowersByUserId(userId);
    return {
      followers: data,
      followerCount: data.length,
    };
  }

  @Get('/followings')
  async followings(@Request() req) {
    const { userId } = req.user;
    const data = await this.followsService.getFollowingsByUserId(userId);
    return {
      followings: data,
      followingCount: data.length,
    };
  }
}
