import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from '@src/users/users.service';
import { Strategy } from 'passport-naver';

@Injectable()
export class NaverAuthStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      clientID: configService.get<string>('NAVER_CLIENT_ID'),
      clientSecret: configService.get<string>('NAVER_CLIENT_SECRET'),
      callbackURL: configService.get<string>('NAVER_CALLBACK_URI'),
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken, refreshToken, profile) {
    const email = profile.emails[0].value;
    const name = profile.displayName;

    let user = await this.usersService.getSocialUserByEmail(email);
    if (!user) {
      user = await this.usersService.socialSignUpTransaction(
        email,
        name,
        'naver',
      );
    }
    const { uid, id } = user;

    return {
      name,
      email,
      uid,
      id,
    };
  }
}
