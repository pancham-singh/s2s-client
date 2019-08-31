import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';
import * as path from 'path';

import { isProduction } from '../../config';
import logger from '../../lib/logger';
import Course from '../../models/Course';
import Permission from '../../models/Permission';
import createCourse from './create';
import deleteCourse from './delete';
import get from './get';
import updateCourse from './update';

const typeDefs = importSchema(path.resolve(__dirname, 'schema.graphql'));

const resolvers = {
  Query: {
    courses: get.getCourses,
    course: get.getCourseDetails
  },
  Mutation: {
    createCourse,
    updateCourse,
    deleteCourse
  }
};

export default makeExecutableSchema({
  typeDefs,
  resolvers
});
