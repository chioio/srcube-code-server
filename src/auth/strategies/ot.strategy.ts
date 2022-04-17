import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { TJwtPayload } from '../typings';

@Injectable()
export class OtStrategy extends PassportStrategy(Strategy, 'jwt-option') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    });
  }

  public async validate(payload: TJwtPayload): Promise<TJwtPayload> {
    return payload;
  }
}
