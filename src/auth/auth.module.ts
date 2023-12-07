import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '@src/users/users.module';
import { AuthService } from './auth.service';
import { GoogleAuthStrategy } from './strategies/google-auth.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { NaverAuthStrategy } from './strategies/naver-auth.strategy';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.startegy';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '30m' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
    GoogleAuthStrategy,
    NaverAuthStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
