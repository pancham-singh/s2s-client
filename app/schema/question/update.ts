import { GqlContext } from '../../custom';
import Question from '../../models/Question';
import logger from '../../lib/logger';
import Course from '../../models/Course';
import Attachment, { AttachmentInput } from '../../models/Attachment';
import Topic from '../../models/Topic';
import Answer from '../../models/Answer';

interface UpdateQuestionInput {
  id: string;
  body: string;
  topic: string;
  points: number;
  answers: [Answer];
  attachments: [Attachment];
  type: 'theory' | 'practical';
}

export default async (_, args: UpdateQuestionInput, { user }: GqlContext) => {
  if (!user) {
    throw new Error('AccessDenied: You must be logged in to perform this operation');
  }

  if (!user.hasPermission('question:write')) {
    throw new Error('AuthorizationError: You are not allowed to perform this operation');
  }

  try {
    const questionToUpdate = await Question.query()
      .where('id', '=', args.id)
      .eager('[ topic, attachments, answers, answers.attachments ]')
      .first();

    if (!questionToUpdate) {
      throw new Error('NotFound: Question not found');
    }

    if (args.topic && String(questionToUpdate.topic.id) !== String(args.topic)) {
      throw new Error('InvlaidTopic: Topic for question does not exist');
    }

    const patch = {
      id: Number(args.id),
      body: args.body,
      points: args.points,
      type: args.type,
      answers: args.answers,
      attachments: args.attachments
    };

    return await Question.query().upsertGraphAndFetch(patch, {
      insertMissing: true,
      noUpdate: ['topic']
    });
  } catch (err) {
    logger.info('Error while updating Question', err);

    throw err;
  }
};
