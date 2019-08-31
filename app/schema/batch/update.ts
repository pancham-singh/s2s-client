import { GqlContext } from '../../custom';
import Batch from '../../models/Batch';
import logger from '../../lib/logger';

interface UpdateBatchInput {
  id: string;
  name?: string;
  startDate?: string;
  endDate?: string;
  trainingCenter: string;
  course: string;
}

const eager = '[ trainingCenter, course ]';

export default async (_, args: UpdateBatchInput, { user }: GqlContext) => {
  try {
    const updatedBatch = await Batch.query()
      .skipUndefined()
      .eager(eager)
      .patchAndFetchById(args.id, {
        name: args.name,
        startDate: args.startDate && new Date(args.startDate),
        endDate: args.endDate && new Date(args.endDate),
        trainingCenterId: args.trainingCenter,
        courseId: args.course
      });

    // there was nothing to update, but we still need to return the batch
    if (!updatedBatch) {
      return await Batch.query()
        .eager(eager)
        .where('id', '=', args.id)
        .first();
    }

    return updatedBatch;
  } catch (err) {
    logger.info('Error while Updating Batch', err);

    throw err;
  }
};
