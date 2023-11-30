import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { LocalAuthGuard } from '@src/auth/local-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    await this.usersService.signup(createUserDto);
    return 'ok';
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return await this.authService.generateToken(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/testJwtGuard')
  test(@Request() req) {
    console.log(req.user);

    return 'ok';
  }
}
