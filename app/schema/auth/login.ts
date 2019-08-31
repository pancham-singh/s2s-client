import User from '../../models/User';
import { isProduction } from '../../config';
import { comparePasswords } from '../../lib/passwords';
import { GqlContext } from '../../custom';

const login = async (
  _,
  { email, password }: { email: string; password: string },
  context: GqlContext
) => {
  try {
    const matchingUser = await User.query()
      .where('email', '=', email)
      .eager('[ roles, roles.permissions ]')
      .first();

    if (!matchingUser) {
      if (isProduction) {
        throw new Error('Unable to log in');
      }

      throw new Error(`No such user with email: ${email}`);
    }

    const isPasswordMatch = await comparePasswords(password, matchingUser.password);

    if (!isPasswordMatch) {
      if (isProduction) {
        throw new Error('Unable to log in');
      }

      throw new Error(`Invalid password.`);
    }

    return { token: matchingUser.authenticate(), user: matchingUser };
  } catch (err) {
    throw err;
  }
};

export default login;
