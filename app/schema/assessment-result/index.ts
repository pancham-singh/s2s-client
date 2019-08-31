import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';
import * as path from 'path';

import { isProduction } from '../../config';
import logger from '../../lib/logger';
import Assessment from '../../models/Assessment';
import Permission from '../../models/Permission';
import createAssessmentResult from './create';
import deleteAssessmentResult from './delete';
import get from './get';
import requireAuth from '../../lib/require-auth';

const typeDefs = importSchema(path.resolve(__dirname, 'schema.graphql'));

const resolvers = {
    Query: {
        assessmentResults: requireAuth(get.getAssessmentResults),
        assessmentResult: requireAuth(get.getAssessmentResultDetails)
    },
    Mutation: {
        createAssessmentResult: requireAuth(createAssessmentResult, ['assessment:write', 'assessment:write:own']),
        deleteAssessmentResult: requireAuth(deleteAssessmentResult, ['assessment:delete', 'assessment:delete:own'])
    }
};

export default makeExecutableSchema({
    typeDefs,
    resolvers
});
