import { GqlContext } from '../../custom';
import Assessment from '../../models/Assessment';
import logger from '../../lib/logger';
import Question from '../../models/Question';
import AssessmentResult from '../../models/AssessmentResult';

interface AssessmentAnswer {
  id: string;
  body: number;
  isCorrect: boolean;
}

interface CreateAssessmentResultInput {
  assessment: string;
  answer: AssessmentAnswer;
  user: string;
}

export default async (_, args: CreateAssessmentResultInput, { user }: GqlContext) => {
    try{
  const newAssessmentResult = await AssessmentResult.query()
            .skipUndefined()
            .first()
            .insertGraphAndFetch(
                {
                    assessment: args.assessment,
                    answer: args.answer,
                    user: user.id
                },
                { relate: true }
            )
            .eager('user');

  return newAssessmentResult;
}catch (err){
  logger.info('Error while creating new Assessment Result', err);

  throw err;
}
};
