import * as path from 'path';
import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';
import { flatten } from 'ramda';

import Attachment from '../../models/Attachment';
import { isProduction } from '../../config';
import { GqlContext } from '../../custom';
import Permission from '../../models/Permission';
import logger from '../../lib/logger';
import { PaginatedQueryInput } from '../query-types';
import Course from '../../models/Course';
import get from './get';
import createAttachment from './create';
import updateAttachment from './update';
import deleteAttachment from './delete';

const typeDefs = importSchema(path.resolve(__dirname, 'schema.graphql'));

const resolvers = {
  Query: {
    attachments: get.getAttachments,
    attachment: get.getAttachmentDetails
  },
  Mutation: {
    createAttachment,
    updateAttachment,
    deleteAttachment
  }
};

export default makeExecutableSchema({
  typeDefs,
  resolvers
});
