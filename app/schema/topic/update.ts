import { GqlContext } from '../../custom';
import Topic from '../../models/Topic';
import logger from '../../lib/logger';
import Module from '../../models/Module';

interface UpdateTopicInput {
  id: string;
  name?: string;
  description?: string;
  icon?: string;
  coverImage?: string;
  module?: string;
  pointsPractical?: number;
  pointsTheory?: number;
}

export default async (_, args: UpdateTopicInput, { user }: GqlContext) => {
  if (!user) {
    throw new Error('AccessDenied: You must be logged in to perform this operation');
  }

  if (!user.hasPermission('topic:write')) {
    throw new Error('AuthorizationError: You are not allowed to perform this operation');
  }

  try {
    let module;
    if (args.module) {
      module = await Module.query().findById(args.module);

      if (!module) {
        throw new Error('InvlaidModule: Module for module does not exist');
      }
    }

    const topicToUpdate = await Topic.query()
      .where('id', '=', args.id)
      .first();

    if (!topicToUpdate) {
      throw new Error('NotFound: Topic not found');
    }

    const patch = {
      name: args.name,
      description: args.description,
      icon: args.icon,
      coverImage: args.coverImage,
      pointsPractical: args.pointsPractical,
      pointsTheory: args.pointsTheory
    };

    if (module) {
      patch.moduleId = module.id;
    }

    await topicToUpdate
      .$query()
      .skipUndefined()
      .patch(patch);

    return await topicToUpdate.$query().eager('module');
  } catch (err) {
    logger.info('Error while updating Topic', err);

    if (/duplicate entry/i.test(err.message)) {
      throw new Error(`DuplicateEntry: There is already a topic with name ${args.name}`);
    }

    throw err;
  }
};
