import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@src/users/users.service';
import * as bcrypt from 'bcrypt';
import { AuthInfo } from './types/auth-info';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<AuthInfo> {
    const user = await this.usersService.getUserByEmail(email);
    if (user && user.password) {
      const { email, id, uid } = user;
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        return { email, userId: id, userUid: uid };
      }
      return null;
    }
    return null;
  }

  async generateToken(user: AuthInfo) {
    const accessToken = this.jwtService.sign(user);
    return accessToken;
  }
  async generateRefreshToken({ userUid }: Partial<AuthInfo>) {
    const refreshToken = this.jwtService.sign(
      { userUid },
      {
        secret: this.configService.get<string>('REFRESH_JWT_SECRET'),
        expiresIn: '10s',
      },
    );
    return refreshToken;
  }
}
