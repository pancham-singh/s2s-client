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
import Course from '../../models/Course';
import createQuestion from './create';

interface GetQuestionInput extends PaginatedQueryInput {
  topic: number;
}

const getQuestions = async (_, { topic, limit, skip }: GetQuestionInput, { user }: GqlContext) => {
  limit = limit || 20;
  skip = skip || 0;

  return await Question.query()
    .where('topic_id', '=', topic)
    .offset(skip)
    .limit(limit)
    .eager('[ attachments, answers, topic ]')
    .orderBy('updated_at');
};

const getQuestionDetails = async (_, { id, questions }) => {
  questions = questions || {};

  return await Question.query()
    .findById(id)
    .eager('[ attachments, answers, answers.attachments, topic, topic.module ]')
    .orderBy('updated_at');
};

export default { getQuestions, getQuestionDetails };
