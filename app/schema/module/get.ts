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
import createModule from './create';

interface GetModuleInput extends PaginatedQueryInput {
  course: number;
}

const getModules = async (_, { course, limit, skip }: GetModuleInput) => {
  limit = limit || 20;
  skip = skip || 0;

  return await Module.query()
    .where('course_id', '=', course)
    .offset(skip)
    .limit(limit)
    .eager('[ course, topics ]')
    .orderBy('updated_at');
};

const getModuleDetails = async (_, { id, modules }) => {
  modules = modules || {};

  return await Module.query()
    .findById(id)
    .eager('[ course, topics ]')
    .orderBy('updated_at');
};

export default { getModules, getModuleDetails };
