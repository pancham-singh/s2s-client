import User from '../../models/User';
import { isProduction } from '../../config';
import { comparePasswords } from '../../lib/passwords';
import { GqlContext } from '../../custom';
import roles from '../../bootstrap/roles';

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: string;
}

const createUser = async (
  _,
  { name, email, password, role }: CreateUserInput,
  { user }: GqlContext
) => {
  let validRoleNames: string[] = [];
  // Non-logged in user can only be student or teacher
  if (!user) {
    validRoleNames = ['teacher', 'student'];
  }

  if (user && user.roles.find((r) => r.name === 'pia')) {
    validRoleNames = ['teacher', 'centerIncharge'];
  }

  if (user && user.roles.find((r) => r.name === 'centerIncharge')) {
    validRoleNames = ['teacher', 'student'];
  }

  if (user && user.roles.find((r) => r.name === 'teacher')) {
    validRoleNames = ['student'];
  }

  if (user && user.roles.find((r) => r.name === 'admin')) {
    validRoleNames = roles.map((r) => r.name);
  }

  if (!validRoleNames.includes(role)) {
    throw new Error(`InvalidRole: Can not creat a user with role: ${role}`);
  }

  // Super admin can create any type of user
  const newUser = await User.createNew({ email, password, name, roles: [role] });

  return {
    token: newUser.authenticate(),
    user: newUser
  };
};

export default createUser;
