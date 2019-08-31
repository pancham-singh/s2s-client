import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';
import * as path from 'path';

import { isProduction } from '../../config';
import logger from '../../lib/logger';
import Assessment from '../../models/Assessment';
import Permission from '../../models/Permission';
import createAssessment from './create';
import deleteAssessment from './delete';
import get from './get';
import updateAssessment from './update';
import requireAuth from '../../lib/require-auth';

const typeDefs = importSchema(path.resolve(__dirname, 'schema.graphql'));

const resolvers = {
  Query: {
    assessments: requireAuth(get.getAssessments),
    assessment: requireAuth(get.getAssessmentDetails)
  },
  Mutation: {
    createAssessment: requireAuth(createAssessment, ['assessment:write', 'assessment:write:own']),
    updateAssessment: requireAuth(updateAssessment, ['assessment:write', 'assessment:write:own']),
    deleteAssessment: requireAuth(deleteAssessment, ['assessment:delete', 'assessment:delete:own'])
  }
};

export default makeExecutableSchema({
  typeDefs,
  resolvers
});
