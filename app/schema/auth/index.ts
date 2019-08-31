import * as path from 'path';
import { importSchema } from 'graphql-import';
import { mergeSchemas, makeExecutableSchema } from 'graphql-tools';

import User from '../../models/User';
import Role from '../../models/Role';
import Permission from '../../models/Permission';
import { isProduction } from '../../config';
import { isStrongPassword, hashPassword, comparePasswords } from '../../lib/passwords';
import logger from '../../lib/logger';
import { GqlContext } from '../../custom';
import createUser from './createUser';
import login from './login';
import currentUser from './currentUser';
import registerWithInvitationToken from './registerWithInvitationToken';

const typeDefs = importSchema(path.resolve(__dirname, 'schema.graphql'));

const resolvers = {
  Query: {
    currentUser
  },
  Mutation: {
    registerWithInvitationToken,
    createUser,
    login
  }
};

export default makeExecutableSchema({
  typeDefs,
  resolvers
});
