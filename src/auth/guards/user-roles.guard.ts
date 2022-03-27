import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../user/schema/user';
import { USER_ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class UserRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requireUserRoles = this.reflector.getAllAndOverride<UserRole[]>(
      USER_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requireUserRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requireUserRoles.some((role) => user.roles?.includes(role));
  }
}
