import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';
import * as path from 'path';
import { flatten } from 'ramda';

import { isProduction } from '../../config';
import { GqlContext } from '../../custom';
import logger from '../../lib/logger';
import Course from '../../models/Course';
import Permission from '../../models/Permission';
import Question from '../../models/Question';
import { PaginatedQueryInput } from '../query-types';
import createQuestion from './create';
import deleteQuestion from './delete';
import get from './get';
import updateQuestion from './update';

const typeDefs = importSchema(path.resolve(__dirname, 'schema.graphql'));

const resolvers = {
  Query: {
    questions: get.getQuestions,
    question: get.getQuestionDetails
  },
  Mutation: {
    createQuestion,
    updateQuestion,
    deleteQuestion
  }
};

export default makeExecutableSchema({
  typeDefs,
  resolvers
});
