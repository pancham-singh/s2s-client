import * as path from 'path';
import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';
import { flatten } from 'ramda';

import Module from '../../models/Module';
import { isProduction } from '../../config';
import { GqlContext } from '../../custom';
import Permission from '../../models/Permission';
import logger from '../../lib/logger';
import { PaginatedQueryInput } from '../query-types';
import Course from '../../models/Course';

interface CreateModuleInput {
  name: string;
  description: string;
  course: string;
  icon?: string;
  coverImage?: string;
}

const createModule = async (_, args: CreateModuleInput, { user }: GqlContext) => {
  if (!user) {
    throw new Error('AccessDenied: You must be logged in to perform this operation');
  }

  if (!user.hasPermission('module:write')) {
    throw new Error('AuthorizationError: You are not allowed to perform this operation');
  }

  try {
    const course = await Course.query()
      .where('id', '=', args.course)
      .first();

    if (!course) {
      throw new Error(`InvalidCourse: Course id is invalid, ${args.course}`);
    }

    const newModule = await Module.query()
      .skipUndefined()
      .first()
      .insertGraphAndFetch(
        [
          {
            name: args.name,
            description: args.description,
            icon: args.icon,
            coverImage: args.coverImage,
            course
          }
        ],
        { relate: true }
      );

    return newModule;
  } catch (err) {
    logger.info('Error while creating new Module', err);

    if (isProduction) {
      throw new Error(`Something went wrong while creating new module`);
    }

    throw err;
  }
};

export default createModule;
