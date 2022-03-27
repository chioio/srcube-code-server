import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../user/schema/user';

export const USER_ROLES_KEY = 'roles';

export const UserRoles = (...roles: UserRole[]) =>
  SetMetadata(USER_ROLES_KEY, roles);
