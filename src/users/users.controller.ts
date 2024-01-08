import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  Response,
  UnauthorizedException,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthService } from '@src/auth/auth.service';
import { GoogleAuthGuard } from '@src/auth/guards/google-auth.guard';
import { KakaoAuthGuard } from '@src/auth/guards/kakao-auth.guard';
import { LocalAuthGuard } from '@src/auth/guards/local-auth.guard';
import { NaverAuthGuard } from '@src/auth/guards/naver-auth.guard';
import { RefreshJwtGuard } from '@src/auth/guards/refresh-jwt-auth.guard';
import { Public } from '@src/decorators/public.decorator';
import { allKeysExist } from '@src/utils';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { VerifyUserEmailDto, VerifyUserIdDto } from './dto/verify-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  cookieOption = {};
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {
    this.cookieOption = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000 * 30, //한 달
      sameSite: 'none',
    };
  }

  @Public()
  @Post('/signup')
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    const userData = await this.usersService.signup(createUserDto);
    return {
      userCustomId: userData.user_custom_id,
    };
  }

  @Patch('/profile')
  @UseInterceptors(FilesInterceptor('image'))
  async updateUserData(
    @Request() req,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @UploadedFiles() image,
    @UploadedFiles() imageBuffers,
    @UploadedFiles() fileNames,
    @UploadedFiles() fileMimeTypes,
    @UploadedFiles() fileSize,
  ) {
    try {
      if (image.length === 0)
        throw new BadRequestException('이미지가 없습니다.');
      const { userUid } = req.user;
      await this.usersService.updateUserData(
        image,
        imageBuffers,
        fileNames,
        fileMimeTypes,
        fileSize,
        userUid,
        updateUserDto,
      );
      return { message: '프로필 업데이트에 성공했습니다.' };
    } catch (err) {
      console.error(err);
    }
  }

  @Public()
  @Post('/id-check')
  async idCheck(@Body(ValidationPipe) verifyUserDto: VerifyUserIdDto) {
    const { userCustomId } = verifyUserDto;
    const user = await this.usersService.getUserByCustomId(userCustomId);
    return { isExistUser: Boolean(user) };
  }

  @Public()
  @Post('/email-check')
  async emailCheck(@Body(ValidationPipe) verifyUserDto: VerifyUserEmailDto) {
    const { email } = verifyUserDto;
    const user = await this.usersService.getUserByEmail(email);
    return { isExistUser: Boolean(user) };
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Response({ passthrough: true }) res, @Request() req) {
    const accessToken = await this.authService.generateToken(req.user);
    const refreshToken = await this.authService.generateRefreshToken(req.user);
    await this.authService.saveRefreshTokenByUserId(
      req.user.userId,
      refreshToken,
    );
    res.cookie('refreshToken', refreshToken, this.cookieOption);

    return {
      accessToken,
    };
  }

  @Get('/logout')
  async logout(@Request() req) {
    await this.authService.deleteRefreshTokenByUserId(req.user.userId);
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

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('/google')
  googleLogin() {}

  @Public()
  @Get('/google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Request() req, @Response({ passthrough: true }) res) {
    return this.handleCallback(req, res);
  }

  @Public()
  @UseGuards(NaverAuthGuard)
  @Get('/naver')
  naverLogin() {}

  @Public()
  @Get('/naver/callback')
  @UseGuards(NaverAuthGuard)
  async naverCallback(@Request() req, @Response({ passthrough: true }) res) {
    return this.handleCallback(req, res);
  }

  @Public()
  @UseGuards(KakaoAuthGuard)
  @Get('/kakao')
  kakaoLogin() {}

  @Public()
  @Get('/kakao/callback')
  @UseGuards(KakaoAuthGuard)
  async kakaoCallback(@Request() req, @Response({ passthrough: true }) res) {
    return this.handleCallback(req, res);
  }

  @Get('/user')
  async getMyData(@Request() req) {
    const { email, userId } = req.user;
    return await this.usersService.getUserData(email, userId);
  }

  @Get('/:userCustomId')
  async getUserData(@Request() req, @Param() param) {
    const { userCustomId } = param;

    const { email, id } =
      await this.usersService.getUserByCustomId(userCustomId);
    return await this.usersService.getUserData(email, id, req.user.userId);
  }

  private async handleCallback(req, res) {
    if (!allKeysExist(req.user, ['name', 'email', 'userUid', 'userId'])) {
      res.redirect(`${this.configService.get<string>('CLIENT_URI')}?code=fail`);
      return;
    }
    const refreshToken = await this.authService.generateRefreshToken(req.user);
    await this.authService.saveRefreshTokenByUserId(
      req.user.userId,
      refreshToken,
    );
    res.cookie('refreshToken', refreshToken, this.cookieOption);
    res.redirect(
      `${this.configService.get<string>('CLIENT_URI')}?code=success`,
    );
    return;
  }
}
