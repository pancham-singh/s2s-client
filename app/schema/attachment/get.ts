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
import createAttachment from './create';

interface GetAttachmentInput extends PaginatedQueryInput {
  question?: number;
  answer?: number;
}

const getAttachments = async (
  _,
  { question, answer, limit, skip }: GetAttachmentInput,
  { user }: GqlContext
) => {
  limit = limit || 20;
  skip = skip || 0;

  if (!user) {
    throw new Error('AccessDenied: You must be logged in to perform this operation');
  }

  if (!user.hasPermission('attachment:read')) {
    throw new Error('AuthorizationError: You are not allowed to perform this operation');
  }

  return await Attachment.query()
    .where('question_id', '=', question)
    .orWhere('answer_id', '=', answer)
    .offset(skip)
    .limit(limit)
    .eager('[  question, answer ]')
    .orderBy('updated_at');
};

const getAttachmentDetails = async (_, { id, attachments }) => {
  attachments = attachments || {};

  return await Attachment.query()
    .findById(id)
    .eager('[ question, answer ]')
    .orderBy('updated_at');
};

export default { getAttachments, getAttachmentDetails };
