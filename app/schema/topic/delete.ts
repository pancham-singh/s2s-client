import { GqlContext } from '../../custom';
import Topic from '../../models/Topic';
import logger from '../../lib/logger';

interface DeleteTopicInput {
  id: string;
}

export default async (_, args: DeleteTopicInput, { user }: GqlContext) => {
  if (!user) {
    throw new Error('AccessDenied: You must be logged in to perform this operation');
  }

  if (!user.hasPermission('topic:delete')) {
    throw new Error('AuthorizationError: You are not allowed to perform this operation');
  }

  try {
    const topicToDelete = await Topic.query()
      .eager('module')
      .findById(args.id);

    if (!topicToDelete) {
      throw new Error('NotFound: Topic not found');
    }

    await topicToDelete.$query().softDelete();

    return topicToDelete;
  } catch (err) {
    logger.info('Error while creating new Topic', err);

    throw err;
  }
};
