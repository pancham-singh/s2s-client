import { GqlContext } from '../../custom';
import TrainingCenter from '../../models/TrainingCenter';
import logger from '../../lib/logger';
import User from '../../models/User';

interface UpdateTrainingCenterInput {
  id: string;
  name?: string;
  address?: string;
  pia?: number;
  incharge?: number;
}

export default async (_, args: UpdateTrainingCenterInput, { user }: GqlContext) => {
  try {
    let pia, incharge;

    if (args.pia) {
      pia = await User.query().findById(args.pia);

      if (!pia) {
        throw new Error('InvlaidPia: Training center for pia does not exist');
      }
    }

    if (args.incharge) {
      incharge = await User.query().findById(args.incharge);

      if (!incharge) {
        throw new Error('InvlaidPia: Training center for incharge does not exist');
      }
    }

    const trainingCenterToUpdate = await TrainingCenter.query()
      .where('id', '=', args.id)
      .first();

    if (!trainingCenterToUpdate) {
      throw new Error('NotFound: TrainingCenter not found');
    }

    const patch = {
      name: args.name,
      address: args.address
    };

    if (pia) {
      patch.piaId = pia.id;
    }

    await trainingCenterToUpdate
      .$query()
      .skipUndefined()
      .patch(patch);

    if (incharge) {
      await trainingCenterToUpdate.$relatedQuery('incharges').unrelate();
      await trainingCenterToUpdate.$relatedQuery('incharges').relate([incharge]);
    }

    return await trainingCenterToUpdate.$query().eager('[ pia, incharges ]');
  } catch (err) {
    logger.info('Error while updating TrainingCenter', err);

    if (/duplicate entry/i.test(err.message)) {
      throw new Error(`DuplicateEntry: There is already a trainingCenter with name ${args.name}`);
    }

    throw err;
  }
};
