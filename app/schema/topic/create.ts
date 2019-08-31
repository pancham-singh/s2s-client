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

interface CreateTopicInput {
  name: string;
  description: string;
  module: string;
  icon?: string;
  coverImage?: string;
  pointsPractical?: number;
  pointsTheory?: number;
}

const createTopic = async (_, args: CreateTopicInput, { user }: GqlContext) => {
  if (!user) {
    throw new Error('AccessDenied: You must be logged in to perform this operation');
  }

  if (!user.hasPermission('topic:write')) {
    throw new Error('AuthorizationError: You are not allowed to perform this operation');
  }

  try {
    const module = await Module.query()
      .where('id', '=', args.module)
      .first();

    if (!module) {
      throw new Error(`InvalidModule: Module id is invalid, ${args.module}`);
    }

    const newTopic = await Topic.query()
      .skipUndefined()
      .first()
      .insertGraphAndFetch(
        [
          {
            name: args.name,
            description: args.description,
            icon: args.icon,
            coverImage: args.coverImage,
            pointsPractical: args.pointsPractical,
            pointsTheory: args.pointsTheory,
            module
          }
        ],
        { relate: true }
      );

    return newTopic;
  } catch (err) {
    logger.info('Error while creating new Topic', err);

    if (isProduction) {
      throw new Error(`Something went wrong while creating new topic`);
    }

    throw err;
  }
};

export default createTopic;
