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
import Module from '../../models/Module';
import createTopic from './create';

interface GetTopicInput extends PaginatedQueryInput {
  module: number;
}

const getTopics = async (_, { module, limit, skip }: GetTopicInput) => {
  limit = limit || 20;
  skip = skip || 0;

  return await Topic.query()
    .where('module_id', '=', module)
    .offset(skip)
    .limit(limit)
    .eager('module')
    .orderBy('updated_at');
};

const getTopicDetails = async (_, { id, topics }) => {
  topics = topics || {};

  return await Topic.query()
    .findById(id)
    .eager('[ module, module.course, questions, questions.attachments ]')
    .orderBy('updated_at');
};

export default { getTopics, getTopicDetails };
