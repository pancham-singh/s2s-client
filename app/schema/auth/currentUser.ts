import { GqlContext } from '../../custom';

const currentUser = async (_, args, { user }: GqlContext) => {
  return user;
};

export default currentUser;
