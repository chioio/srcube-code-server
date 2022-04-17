import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';

/**
 * A decorator for get the current authenticated user.
 *
 * @author chioio
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    if (req.user) {
      Logger.log(JSON.stringify(req?.user), 'CurrentUser');

      if (!data) return req?.user;

      return req.user[data];
    }

    return null;
  },
);
