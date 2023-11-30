import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import { LocalAuthGuard } from '@src/auth/local-auth.guard';
import { RefreshJwtGuard } from '@src/auth/refresh-jwt-auth.guard';
import { Public } from '@src/decorators/public.decorator';
import { allKeysExist } from '@src/utils';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Public()
  @Post('/signup')
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    await this.usersService.signup(createUserDto);
    return 'ok';
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    const accessToken = await this.authService.generateToken(req.user);
    const refreshToken = await this.authService.generateRefreshToken(req.user);
    return {
      accessToken,
      refreshToken,
    };
  }
  @Public()
  @UseGuards(RefreshJwtGuard)
  @Post('/refresh-token')
  async refreshToken(@Request() req) {
    if (!allKeysExist(req.user, ['userId', 'userUid', 'email'])) {
      throw new UnauthorizedException(
        '요청이 유효하지 않습니다. 다시 로그인 해주세요.',
      );
    }
    const accessToken = await this.authService.generateToken(req.user);
    return {
      accessToken,
    };
  }

  @Get('/testJwtGuard')
  test(@Request() req) {
    console.log(req.user);

    return 'ok';
  }
}
