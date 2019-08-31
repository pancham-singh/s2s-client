import { GqlContext } from '../../custom';
import Batch from '../../models/Batch';
import logger from '../../lib/logger';

interface DeleteBatchInput {
  id: string;
}

export default async (_, args: DeleteBatchInput, { user }: GqlContext) => {
  try {
    const batchToDelete = await Batch.query()
      .eager('[ trainingCenter, course ]')
      .findById(args.id);

    if (!batchToDelete) {
      throw new Error('NotFound: Batch not found');
    }

    await batchToDelete.$query().softDelete();

    return batchToDelete;
  } catch (err) {
    logger.info('Error while deleting Batch', err);

    throw err;
  }
};
