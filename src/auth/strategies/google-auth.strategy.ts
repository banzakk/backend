import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from '@src/users/users.service';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URI'),
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken, refreshToken, profile) {
    const email = profile.emails[0].value;
    const name = profile.displayName;
    const socialUser = await this.usersService.getSocialUserByEmail(email);
    let user;
    if (socialUser) user = socialUser.user;
    if (
      !socialUser ||
      (socialUser.user && socialUser.socialType !== 'google')
    ) {
      user = await this.usersService.socialSignUpTransaction(
        email,
        name,
        'google',
      );
    }

    const { uid, id } = user;

    return {
      name,
      email,
      userUid: uid,
      userId: id,
    };
  }
}
