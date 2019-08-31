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
import Question from '../../models/Question';
import { AttachmentInput } from '../../models/Attachment';
import Answer from '../../models/Answer';

interface CreateAttachmentInput {
  question: string;
  answer: string;
  url: string;
  type: 'image' | 'video' | 'audio';
}

const createAttachment = async (_, args: CreateAttachmentInput, { user }: GqlContext) => {
  if (!user) {
    throw new Error('AccessDenied: You must be logged in to perform this operation');
  }

  if (!user.hasPermission('attachment:write')) {
    throw new Error('AuthorizationError: You are not allowed to perform this operation');
  }

  if (!args.question && !args.answer) {
    throw new Error('InvalidInput: An attachment must be attached to an answer or a question');
  }

  if (args.question && args.answer) {
    throw new Error(
      'InvalidInput: An attachment can not be attached to both an answer and a question'
    );
  }

  try {
    const master = await (args.question ? Question.query() : Answer.query())
      .where('id', '=', args.question || args.answer)
      .first();

    if (!master) {
      throw new Error(
        `InvalidAttachee: ${args.question ? 'Question' : 'Answer'} id is invalid, ${args.question ||
          args.answer}`
      );
    }

    const graphToInsert = { url: args.url, type: args.type };

    if (args.question) {
      graphToInsert.question = master;
    } else graphToInsert.answer = master;

    const newAttachment = await Attachment.query()
      .skipUndefined()
      .first()
      .insertGraphAndFetch([graphToInsert], { relate: true });

    return newAttachment;
  } catch (err) {
    logger.info('Error while creating new Attachment', err);

    if (isProduction) {
      throw new Error(`Something went wrong while creating new attachment`);
    }

    throw err;
  }
};

export default createAttachment;
