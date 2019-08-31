import { GqlContext } from '../../custom';
import Assessment from '../../models/Assessment';
import logger from '../../lib/logger';
import Question from '../../models/Question';

interface UpdateAssessmentInput {
  name: string;
  durationMinutes: number;
  startDate: string;
  endDate: string;
}

const eager = '[ questions, topics, createdBy ]';

export default async (_, args: UpdateAssessmentInput, { user }: GqlContext) => {
  try {
    const newAssessment = await Assessment.query()
      .skipUndefined()
      .insertGraphAndFetch(
        {
          name: args.name,
          durationMinutes: args.durationMinutes,
          startDate: new Date(args.startDate),
          endDate: new Date(args.endDate)
        },
        { relate: true }
      )
      .eager(eager);

    return newAssessment;
  } catch (err) {
    logger.info('Error while creating new Assessment', err);

    throw err;
  }
};
