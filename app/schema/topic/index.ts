import * as path from 'path';
import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';
import { flatten } from 'ramda';

import Topic from '../../models/Topic';
import { isProduction } from '../../config';
import { GqlContext } from '../../custom';
import Permission from '../../models/Permission';
import logger from '../../lib/logger';
import { PaginatedQueryInput } from '../query-types';
import Course from '../../models/Course';
import get from './get';
import createTopic from './create';
import updateTopic from './update';
import deleteTopic from './delete';

const typeDefs = importSchema(path.resolve(__dirname, 'schema.graphql'));

const resolvers = {
  Query: {
    topics: get.getTopics,
    topic: get.getTopicDetails
  },
  Mutation: {
    createTopic,
    updateTopic,
    deleteTopic
  }
};

export default makeExecutableSchema({
  typeDefs,
  resolvers
});
