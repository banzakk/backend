import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@src/users/users.service';
import * as bcrypt from 'bcrypt';
import { Redis } from 'ioredis';
import { AuthInfo } from './types/auth-info';

@Injectable()
export class AuthService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
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

  generateToken(user: AuthInfo): string {
    const accessToken = this.jwtService.sign(user);
    return accessToken;
  }

  generateRefreshToken({ userUid }: Partial<AuthInfo>): string {
    const refreshToken = this.jwtService.sign(
      { userUid },
      {
        secret: this.configService.get<string>('REFRESH_JWT_SECRET'),
        expiresIn: '30d',
      },
    );
    return refreshToken;
  }

  async saveRefreshTokenByUserId(userId: string, token: string): Promise<void> {
    const decoded = this.jwtService.decode(token);
    const exp = decoded.exp;
    const now = Math.floor(Date.now() / 1000);
    await this.redisClient.set(
      `refresh_token:${userId}`,
      token,
      'EX',
      exp - now,
    );
  }

  async getRefreshTokenByUserId(userId: string): Promise<string> {
    return await this.redisClient.get(`refresh_token:${userId}`);
  }
}
