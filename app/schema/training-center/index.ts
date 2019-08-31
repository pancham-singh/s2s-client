import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';
import * as path from 'path';
import { flatten } from 'ramda';

import { isProduction } from '../../config';
import { GqlContext } from '../../custom';
import logger from '../../lib/logger';
import requireAuth from '../../lib/require-auth';
import Course from '../../models/Course';
import Permission from '../../models/Permission';
import TrainingCenter from '../../models/TrainingCenter';
import { PaginatedQueryInput } from '../query-types';
import createTrainingCenter from './create';
import deleteTrainingCenter from './delete';
import get from './get';
import updateTrainingCenter from './update';

const typeDefs = importSchema(path.resolve(__dirname, 'schema.graphql'));

const resolvers = {
  Query: {
    trainingCenters: requireAuth(get.getTrainingCenters, [
      'trainingCenter:read',
      'trainingCenter:read:own'
    ]),
    trainingCenter: requireAuth(get.getTrainingCenterDetails, [
      'trainingCenter:read',
      'trainingCenter:read:own'
    ])
  },
  Mutation: {
    createTrainingCenter: requireAuth(createTrainingCenter, [
      'trainingCenter:write',
      'trainingCenter:write:own'
    ]),
    updateTrainingCenter: requireAuth(updateTrainingCenter, [
      'trainingCenter:write',
      'trainingCenter:write:own'
    ]),
    deleteTrainingCenter: requireAuth(deleteTrainingCenter, [
      'trainingCenter:delete',
      'trainingCenter:delete:own'
    ])
  }
};

export default makeExecutableSchema({
  typeDefs,
  resolvers
});
