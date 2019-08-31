import { GqlContext } from '../custom';

type QueryFunc = (a: any, args: any, context: GqlContext) => Promise<any>;

const requireAuth = (func: QueryFunc, permissions?: string[]) => async (
  a1,
  args,
  context: GqlContext
) => {
  const user = context.user;

  if (!user) {
    throw new Error('AccessDenied: You must be logged in to perform this operation');
  }

  let unauthorized = true;

  if (!permissions || !permissions.length) {
    unauthorized = false;
  }

  for (const p of permissions || []) {
    if (user.hasPermission(p)) {
      unauthorized = false;
    }
  }

  if (unauthorized) {
    throw new Error('AuthorizationError: You are not allowed to perform this operation');
  }

  return await func(a1, args, context);
};

export default requireAuth;
