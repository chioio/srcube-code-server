import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { TJwtPayload } from '../typings';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  public async validate(
    req: Request,
    payload: TJwtPayload,
  ): Promise<TJwtPayload & { refreshToken: string }> {
    const refreshToken = req.get('authorization').replace('Bearer ', '').trim();

    return {
      ...payload,
      refreshToken,
    };
  }
}
