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
import get from './get';
import createModule from './create';
import updateModule from './update';
import deleteModule from './delete';

const typeDefs = importSchema(path.resolve(__dirname, 'schema.graphql'));

const resolvers = {
  Query: {
    modules: get.getModules,
    module: get.getModuleDetails
  },
  Mutation: {
    createModule,
    updateModule,
    deleteModule
  }
};

export default makeExecutableSchema({
  typeDefs,
  resolvers
});
