import { GqlContext } from '../../custom';
import Assessment from '../../models/Assessment';
import logger from '../../lib/logger';
import Question from '../../models/Question';

interface AssesmentTopic {
  topic: string;
  theoryCount: number;
  practicalCount: number;
}

interface CreateAssessmentInput {
  name: string;
  topics: AssesmentTopic[];
  batch: string;
  durationMinutes: number;
  startDate: string;
  endDate: string;
}

export default async (_, args: CreateAssessmentInput, { user }: GqlContext) => {
  try {
    let questions = [];

    for (const ti of args.topics) {
      const theoryQs = await Question.query()
        .where('question.topic_id', '=', ti.topic)
        .andWhere('question.type', '=', 'theory')
        .limit(ti.theoryCount);

      const practicalQs = await Question.query()
        .where('question.topic_id', '=', ti.topic)
        .andWhere('question.type', '=', 'practical')
        .limit(ti.practicalCount);

      questions = questions.concat(theoryQs, practicalQs);
    }

    const newAssessment = await Assessment.query()
      .skipUndefined()
      .insertGraphAndFetch(
        {
          name: args.name,
          batchId: args.batch,
          durationMinutes: args.durationMinutes,
          startDate: new Date(args.startDate),
          endDate: new Date(args.endDate),
          topics: args.topics.map((t) => ({ id: t.topic })),
          createdById: user.id,
          questions
        },
        { relate: true }
      )
      .eager('createdBy');

    return newAssessment;
  } catch (err) {
    logger.info('Error while creating new Assessment', err);

    throw err;
  }
};
