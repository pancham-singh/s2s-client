import * as path from 'path';
import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';
import { flatten } from 'ramda';

import Answer from '../../models/Answer';
import { isProduction } from '../../config';
import { GqlContext } from '../../custom';
import Permission from '../../models/Permission';
import logger from '../../lib/logger';
import { PaginatedQueryInput } from '../query-types';
import Course from '../../models/Course';
import get from './get';
import createAssessmentAnswer from './create';
import deleteAssessmentAnswer from './delete';

const typeDefs = importSchema(path.resolve(__dirname, 'schema.graphql'));

const resolvers = {
    Query: {
        assessmentAnswers: get.getAssessmentAnswers,
        assessmentAnswer: get.getAssessmentAnswerDetails
    },
    Mutation: {
        createAssessmentAnswer,
        deleteAssessmentAnswer
    }
};

export default makeExecutableSchema({
    typeDefs,
    resolvers
});
