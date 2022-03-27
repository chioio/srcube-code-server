import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * A decorator for get the current authenticated user.
 *
 * @author chioio
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) =>
    GqlExecutionContext.create(context).getContext().req.user,
);
