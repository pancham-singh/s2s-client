import * as path from 'path';
import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';
import { flatten } from 'ramda';

import Answer from '../../models/Answer';
import { isProduction } from '../../config';
import { GqlContext } from '../../custom';
import Permission from '../../models/Permission';
import logger from '../../lib/logger';
import { PaginatedQueryInput } from '../query-types';
import Question from '../../models/Question';
import { AttachmentInput } from '../../models/Attachment';

interface CreateAnswerInput {
  body: string;
  question: string;
  attachments: AttachmentInput[];
  isCorrect: boolean;
}

const createAnswer = async (_, args: CreateAnswerInput, { user }: GqlContext) => {
  if (!user) {
    throw new Error('AccessDenied: You must be logged in to perform this operation');
  }

  if (!user.hasPermission('answer:write')) {
    throw new Error('AuthorizationError: You are not allowed to perform this operation');
  }

  try {
    const question = await Question.query()
      .where('id', '=', args.question)
      .first();

    if (!question) {
      throw new Error(`InvalidQuestion: Question id is invalid, ${args.question}`);
    }

    const newAnswer = await Answer.query()
      .skipUndefined()
      .first()
      .insertGraphAndFetch(
        [
          {
            body: args.body,
            isCorrect: args.isCorrect,
            attachments: args.attachments,
            question
          }
        ],
        { relate: true }
      );

    return newAnswer;
  } catch (err) {
    logger.info('Error while creating new Answer', err);

    if (isProduction) {
      throw new Error(`Something went wrong while creating new answer`);
    }

    throw err;
  }
};

export default createAnswer;
