import Batch from '../../models/Batch';
import { GqlContext } from '../../custom';

const eager = '[ trainingCenter, course ]';

const getBatches = async (_, args, { user }: GqlContext) => {
  const limit = args.limit || 20;
  const skip = args.skip || 0;

  let query = Batch.query()
    .offset(skip)
    .limit(limit)
    .eager(eager)
    .orderBy('updated_at');

  if (user.hasRole('teacher')) {
    query = query
      .where({ 'user_batches.user_id': user.id, 'user_batches.role': 'teacher' })
      .join('user_batches', 'user_batches.batch_id', 'batch.id');
  }

  return await query;
};

const getBatchDetails = async (_, { id }, { user }: GqlContext) => {
  let query = Batch.query()
    .findById(id)
    .eager(eager)
    .orderBy('updated_at');

  if (user.hasRole('teacher')) {
    query = query
      .where({ 'user_batches.user_id': user.id, 'user_batches.role': 'teacher' })
      .join('user_batches', 'user_batches.batch_id', 'batch.id');
  }

  return await query;
};

export default { getBatches, getBatchDetails };
