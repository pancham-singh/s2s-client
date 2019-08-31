import User from '../../models/User';

const getUsers = async (_, { limit, skip }) => {
  limit = limit || 20;
  skip = skip || 0;

  return await User.query()
    .offset(skip)
    .limit(limit)
    .eager('[ roles, roles.permissions ]')
    .orderBy('updated_at');
};

const getUserDetails = async (_, { id, topics }) => {
  topics = topics || {};

  return await User.query()
    .findById(id)
    .eager('[ roles, roles.permissions ]');
};

export default { getUsers, getUserDetails };
