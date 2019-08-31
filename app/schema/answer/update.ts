import { GqlContext } from '../../custom';
import Answer from '../../models/Answer';
import logger from '../../lib/logger';
import Course from '../../models/Course';
import { AttachmentInput } from '../../models/Attachment';

interface UpdateAnswerInput {
  id: string;
  body?: string;
  isCorrect?: boolean;
}

export default async (_, args: UpdateAnswerInput, { user }: GqlContext) => {
  if (!user) {
    throw new Error('AccessDenied: You must be logged in to perform this operation');
  }

  if (!user.hasPermission('answer:write')) {
    throw new Error('AuthorizationError: You are not allowed to perform this operation');
  }

  try {
    const answerToUpdate = await Answer.query()
      .where('id', '=', args.id)
      .first();

    if (!answerToUpdate) {
      throw new Error('NotFound: Answer not found');
    }

    const patch = {
      body: args.body,
      isCorrect: args.isCorrect
    };

    await answerToUpdate
      .$query()
      .skipUndefined()
      .patch(patch);

    return await answerToUpdate.$query().eager('[ question, attachments, question.attachments ]');
  } catch (err) {
    logger.info('Error while updating Answer', err);

    if (/duplicate entry/i.test(err.message)) {
      throw new Error(`DuplicateEntry: There is already a answer with name ${args.name}`);
    }

    throw err;
  }
};
