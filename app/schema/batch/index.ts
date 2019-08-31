import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';
import * as path from 'path';

import { isProduction } from '../../config';
import logger from '../../lib/logger';
import requireAuth from '../../lib/require-auth';
import Batch from '../../models/Batch';
import Permission from '../../models/Permission';
import createBatch from './create';
import deleteBatch from './delete';
import get from './get';
import updateBatch from './update';

const typeDefs = importSchema(path.resolve(__dirname, 'schema.graphql'));

const resolvers = {
  Query: {
    batches: requireAuth(get.getBatches, ['batch:read', 'batch:read:own']),
    batch: requireAuth(get.getBatchDetails, ['batch:read', 'batch:read:own'])
  },
  Mutation: {
    createBatch: requireAuth(createBatch, ['batch:write', 'batch:write:own']),
    updateBatch: requireAuth(updateBatch, ['batch:write', 'batch:write:own']),
    deleteBatch: requireAuth(deleteBatch, ['batch:write', 'batch:write:own'])
  }
};

export default makeExecutableSchema({
  typeDefs,
  resolvers
});
