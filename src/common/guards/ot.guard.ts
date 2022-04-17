import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OtGuard extends AuthGuard('jwt-option') {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: any,
    status?: any,
  ): TUser {
    if (user) {
      return user;
    } else {
      return null;
    }
  }
}
