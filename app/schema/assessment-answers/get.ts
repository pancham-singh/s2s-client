import * as path from 'path';
import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';
import { flatten } from 'ramda';

import AssessmentAnswer from '../../models/AssessmentAnswer';
import { isProduction } from '../../config';
import { GqlContext } from '../../custom';
import Permission from '../../models/Permission';
import logger from '../../lib/logger';
import { PaginatedQueryInput } from '../query-types';
import Course from '../../models/Course';
import createAnswer from './create';

interface GetAnswerInput extends PaginatedQueryInput {
    question: number;
}

const getAssessmentAnswers = async (_, { question, limit, skip }: GetAnswerInput, { user }: GqlContext) => {
    limit = limit || 20;
    skip = skip || 0;

    if (!user) {
        throw new Error('AccessDenied: You must be logged in to perform this operation');
    }

    if (!user.hasPermission('answer:read')) {
        throw new Error('AuthorizationError: You are not allowed to perform this operation');
    }

    return await AssessmentAnswer.query()
        .where('question_id', '=', question)
        .offset(skip)
        .limit(limit)
        .eager('[  question, attachments, question.attachments ]')
        .orderBy('updated_at');
};

const getAssessmentAnswerDetails = async (_, { id, answers }) => {
    answers = answers || {};

    return await AssessmentAnswer.query()
        .findById(id)
        .eager('[  question, attachments, question.attachments ]')
        .orderBy('updated_at');
};

export default { getAssessmentAnswers, getAssessmentAnswerDetails };
