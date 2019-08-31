import { GqlContext } from '../../custom';
import Batch from '../../models/Batch';
import Permission from '../../models/Permission';
import logger from '../../lib/logger';

interface CreateBatchInput {
  name: string;
  startDate: string;
  endDate: string;
  trainingCenter: string;
  course: string;
}

export default async (_, args: CreateBatchInput, { user }: GqlContext) => {
  try {
    const newBatch = await Batch.query()
      .insertAndFetch({
        name: args.name,
        startDate: new Date(args.startDate),
        endDate: new Date(args.endDate),
        trainingCenterId: args.trainingCenter,
        courseId: args.course
      })
      .eager('[ course, trainingCenter ]');

    return newBatch;
  } catch (err) {
    logger.info('Error while creating new Batch', err);

    throw err;
  }
};
