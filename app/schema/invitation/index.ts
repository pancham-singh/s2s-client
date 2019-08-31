import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';
import * as path from 'path';

import { isProduction } from '../../config';
import logger from '../../lib/logger';
import requireAuth from '../../lib/require-auth';
import Invitation from '../../models/Invitation';
import get from './get';
import create from './create';
import deleteInvitation from './delete';
import acceptInvitation from './accept';

const typeDefs = importSchema(path.resolve(__dirname, 'schema.graphql'));

const resolvers = {
  Query: {
    invitations: requireAuth(get.getInvitations, ['invitation:read', 'invitation:read:own']),
    invitation: requireAuth(get.getInvitationDetails, ['invitation:read', 'invitation:read:own']),
    invitationForToken: get.getInvitationForToken
  },
  Mutation: {
    createInvitation: requireAuth(create, ['invitation:write', 'invitation:write:own']),
    deleteInvitation: requireAuth(deleteInvitation, ['invitation:delete', 'invitation:delete:own']),
    acceptInvitation: requireAuth(acceptInvitation)
  }
};

export default makeExecutableSchema({
  typeDefs,
  resolvers
});
