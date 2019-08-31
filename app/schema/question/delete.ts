import { GqlContext } from '../../custom';
import Question from '../../models/Question';
import logger from '../../lib/logger';

interface DeleteQuestionInput {
  id: string;
}

export default async (_, args: DeleteQuestionInput, { user }: GqlContext) => {
  if (!user) {
    throw new Error('AccessDenied: You must be logged in to perform this operation');
  }

  if (!user.hasPermission('question:delete')) {
    throw new Error('AuthorizationError: You are not allowed to perform this operation');
  }

  try {
    const questionToDelete = await Question.query()
      .eager('[ answers, attachments ]')
      .findById(args.id);

    if (!questionToDelete) {
      throw new Error('NotFound: Question not found');
    }

    await questionToDelete.$query().softDelete();
    await questionToDelete.$relatedQuery('attachments').softDelete();
    await questionToDelete.$relatedQuery('answers').softDelete();

    return questionToDelete;
  } catch (err) {
    logger.info('Error while creating new Question', err);

    throw err;
  }
};
