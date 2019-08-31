import { GqlContext } from '../../custom';
import TrainingCenter from '../../models/TrainingCenter';
import logger from '../../lib/logger';

interface DeleteTrainingCenterInput {
  id: string;
}

export default async (_, args: DeleteTrainingCenterInput, { user }: GqlContext) => {
  try {
    const trainingCenterToDelete = await TrainingCenter.query()
      .eager('[ pia, incharges ]')
      .findById(args.id);

    if (!trainingCenterToDelete) {
      throw new Error('NotFound: TrainingCenter not found');
    }

    await trainingCenterToDelete.$query().softDelete();

    return trainingCenterToDelete;
  } catch (err) {
    logger.info('Error while creating new TrainingCenter', err);

    throw err;
  }
};
