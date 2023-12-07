import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { AuthInfo } from '../types/auth-info';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }
  async validate(email: string, password: string): Promise<AuthInfo> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('로그인이 필요한 서비스입니다.');
    }
    return user;
  }
}
