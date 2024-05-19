import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { loginWithGoogle } from '../dtos/request';

export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL_GOOGLE,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    console.log(profile);
    const user: loginWithGoogle = {
      provider: 'google',
      providerID: profile.id,
      username: profile.displayName,
      email: profile.emails[0].value,
      name: {
        givenName: profile.name.givenName,
        familyName: profile.name.familyName,
      },
      picture: profile.photos[0].value,
    };
    console.log(user);
    done(null, user);
  }
}
