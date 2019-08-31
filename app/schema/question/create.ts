import * as path from 'path';
import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';
import { flatten } from 'ramda';

import Question from '../../models/Question';
import { isProduction } from '../../config';
import { GqlContext } from '../../custom';
import Permission from '../../models/Permission';
import logger from '../../lib/logger';
import { PaginatedQueryInput } from '../query-types';
import Topic from '../../models/Topic';
import { AttachmentInput } from '../../models/Attachment';

interface AnswerInput {
  body: string;
  isCorrect: boolean;
  attachments: AttachmentInput[];
}

interface CreateQuestionInput {
  body: string;
  topic: string;
  points: number;
  answers: AnswerInput[];
  attachments: AttachmentInput[];
  type: 'theory' | 'practical';
}

const createQuestion = async (_, args: CreateQuestionInput, { user }: GqlContext) => {
  if (!user) {
    throw new Error('AccessDenied: You must be logged in to perform this operation');
  }

  if (!user.hasPermission('question:write')) {
    throw new Error('AuthorizationError: You are not allowed to perform this operation');
  }

  try {
    const topic = await Topic.query()
      .where('id', '=', args.topic)
      .first();

    if (!topic) {
      throw new Error(`InvalidCourse: Topic id is invalid, ${args.topic}`);
    }

    const newQuestion = await Question.query()
      .skipUndefined()
      .first()
      .insertGraphAndFetch(
        [
          {
            body: args.body,
            points: args.points,
            type: args.type,
            answers: args.answers,
            attachments: args.attachments,
            topic
          }
        ],
        { relate: true }
      );

    return newQuestion;
  } catch (err) {
    logger.info('Error while creating new Question', err);

    if (isProduction) {
      throw new Error(`Something went wrong while creating new question`);
    }

    throw err;
  }
};

export default createQuestion;
