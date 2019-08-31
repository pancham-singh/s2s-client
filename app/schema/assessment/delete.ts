import { GqlContext } from '../../custom';
import Assessment from '../../models/Assessment';
import logger from '../../lib/logger';

interface DeleteAssessmentInput {
  id: string;
}

const eager = '[ questions, topics, createdBy ]';

export default async (_, args: DeleteAssessmentInput, { user }: GqlContext) => {
  try {
    const assessmentToDelete = await Assessment.query()
      .eager(eager)
      .findById(args.id);

    if (!assessmentToDelete) {
      throw new Error('NotFound: Assessment not found');
    }

    await assessmentToDelete.$query().softDelete();

    return assessmentToDelete;
  } catch (err) {
    logger.info('Error while creating new Assessment', err);

    throw err;
  }
};
