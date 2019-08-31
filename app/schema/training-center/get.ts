import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';
import * as path from 'path';
import { flatten } from 'ramda';
import { isProduction } from '../../config';

import { GqlContext } from '../../custom';
import logger from '../../lib/logger';
import Module from '../../models/Module';
import Permission from '../../models/Permission';
import TrainingCenter from '../../models/TrainingCenter';
import { PaginatedQueryInput } from '../query-types';
import createTrainingCenter from './create';

interface GetTrainingCenterInput extends PaginatedQueryInput {
  pia?: number;
  incharges?: number[];
}

const getTrainingCenters = async (_, args: GetTrainingCenterInput, { user }: GqlContext) => {
  const limit = args.limit || 20;
  const skip = args.skip || 0;

  let query = TrainingCenter.query()
    .offset(skip)
    .limit(limit)
    .eager('[ pia, incharges ]')
    .orderBy('updated_at');

  if (user.hasRole('pia')) {
    query = query.where('pia_id', '=', user.id);
  }

  if (args.pia) {
    query.where('pia_id', '=', args.pia);
  }

  if (user.hasRole('centerIncharge')) {
    query = query
      .where({ 'tci.user_id': user.id })
      .join('training_center_incharges as tci', 'tci.training_center_id', 'training_center.id');
  }

  return await query;
};

const getTrainingCenterDetails = async (_, { id }) => {
  return await TrainingCenter.query()
    .findById(id)
    .eager('[ pia, incharges ]');
};

export default { getTrainingCenters, getTrainingCenterDetails };
