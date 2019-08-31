import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';
import * as path from 'path';

import { isProduction } from '../../config';
import logger from '../../lib/logger';
import requireAuth from '../../lib/require-auth';
import Permission from '../../models/Permission';
import User from '../../models/User';
import get from './get';

const typeDefs = importSchema(path.resolve(__dirname, 'schema.graphql'));

const resolvers = {
  Query: {
    users: requireAuth(get.getUsers, ['user:read', 'user:read:own']),
    user: requireAuth(get.getUserDetails, ['user:read', 'user:read:own'])
  }
};

export default makeExecutableSchema({
  typeDefs,
  resolvers
});
