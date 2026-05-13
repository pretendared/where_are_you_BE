import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UserProvider } from '../entities/auth.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/login/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
  accessToken: string,
  refreshToken: string,
  profile: any,
  ) {
    const { id, emails, name } = profile;

    const user = {
      userId: id,
      email: emails[0].value,
      name,
      provider: UserProvider.google
    };
    return user;
  }
}