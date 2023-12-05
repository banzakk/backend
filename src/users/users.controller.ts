import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
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
  async login(@Res({ passthrough: true }) res, @Request() req) {
    const accessToken = await this.authService.generateToken(req.user);
    const refreshToken = await this.authService.generateRefreshToken(req.user);
    await this.authService.saveRefreshTokenByUserId(
      req.user.userId,
      refreshToken,
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/users/refresh-token',
      maxAge: 24 * 60 * 60 * 1000 * 30, //한 달
      sameSite: 'none',
    });

    return {
      accessToken,
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
    const storedRefreshToken = await this.authService.getRefreshTokenByUserId(
      req.user.userId,
    );
    if (req.cookies.refreshToken !== storedRefreshToken) {
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
