import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';
import * as path from 'path';
import { flatten } from 'ramda';

import { isProduction } from '../../config';
import { GqlContext } from '../../custom';
import logger from '../../lib/logger';
import TrainingCenter from '../../models/TrainingCenter';
import User from '../../models/User';
import { PaginatedQueryInput } from '../query-types';

interface CreateTrainingCenterInput {
  name: string;
  address: string;
  pia: number;
  incharge?: number;
}

const createTrainingCenter = async (_, args: CreateTrainingCenterInput, { user }: GqlContext) => {
  try {
    let incharge;

    const pia = await User.query().findById(args.pia);

    if (!pia) {
      throw new Error(`InvalidModule: PIA id is invalid, ${args.pia}`);
    }

    const payload = {
      name: args.name,
      address: args.address,
      pia
    };

    if (args.incharge) {
      incharge = await User.query().findById(args.incharge);

      if (!incharge) {
        throw new Error(`InvalidModule: Incharge id is invalid, ${args.pia}`);
      }

      payload.incharges = [incharge];
    }

    const newTrainingCenter = await TrainingCenter.query()
      .skipUndefined()
      .first()
      .eager('[ pia, incharges ]')
      .insertGraphAndFetch([payload], { relate: true });

    return newTrainingCenter;
  } catch (err) {
    logger.info('Error while creating new TrainingCenter', err);

    if (isProduction) {
      throw new Error(`Something went wrong while creating new trainingCenter`);
    }

    throw err;
  }
};

export default createTrainingCenter;
