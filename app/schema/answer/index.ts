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
import createAnswer from './create';
import updateAnswer from './update';
import deleteAnswer from './delete';

const typeDefs = importSchema(path.resolve(__dirname, 'schema.graphql'));

const resolvers = {
  Query: {
    answers: get.getAnswers,
    answer: get.getAnswerDetails
  },
  Mutation: {
    createAnswer,
    updateAnswer,
    deleteAnswer
  }
};

export default makeExecutableSchema({
  typeDefs,
  resolvers
});
