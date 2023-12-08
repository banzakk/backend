import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from '@src/users/users.service';
import { Strategy } from 'passport-kakao';

@Injectable()
export class KakaoAuthStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      clientID: configService.get<string>('KAKAO_CLIENT_ID'),
      clientSecret: configService.get<string>('KAKAO_CLIENT_SECRET'),
      callbackURL: configService.get<string>('KAKAO_CALLBACK_URI'),
      scope: ['account_email', 'profile_nickname'],
    });
  }

  async validate(accessToken, refreshToken, profile) {
    const { _json } = profile;
    const email = _json.kakao_account.email;
    const name = _json.kakao_account.profile.nickname;

    const socialUser = await this.usersService.getSocialUserByEmail(email);
    let user = socialUser.user;
    if (!user || (user && socialUser.type !== 'kakao')) {
      user = await this.usersService.socialSignUpTransaction(
        email,
        name,
        'kakao',
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
