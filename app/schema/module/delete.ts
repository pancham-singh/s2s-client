import { GqlContext } from '../../custom';
import Module from '../../models/Module';
import logger from '../../lib/logger';

interface DeleteModuleInput {
  id: string;
}

export default async (_, args: DeleteModuleInput, { user }: GqlContext) => {
  if (!user) {
    throw new Error('AccessDenied: You must be logged in to perform this operation');
  }

  if (!user.hasPermission('module:delete')) {
    throw new Error('AuthorizationError: You are not allowed to perform this operation');
  }

  try {
    const moduleToDelete = await Module.query()
      .eager('[ course, topics ]')
      .findById(args.id);

    if (!moduleToDelete) {
      throw new Error('NotFound: Module not found');
    }

    await moduleToDelete.$query().softDelete();
    await moduleToDelete.$relatedQuery('topics').softDelete();

    return moduleToDelete;
  } catch (err) {
    logger.info('Error while creating new Module', err);

    throw err;
  }
};
