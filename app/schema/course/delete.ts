import { GqlContext } from '../../custom';
import Course from '../../models/Course';
import logger from '../../lib/logger';
import Topic from '../../models/Topic';

interface DeleteCourseInput {
  id: string;
}

export default async (_, args: DeleteCourseInput, { user }: GqlContext) => {
  if (!user) {
    throw new Error('AccessDenied: You must be logged in to perform this operation');
  }

  if (!user.hasPermission('course:delete')) {
    throw new Error('AuthorizationError: You are not allowed to perform this operation');
  }

  try {
    const courseToDelete = await Course.query()
      .eager('[ modules, modules.topics ]')
      .findById(args.id);

    if (!courseToDelete) {
      throw new Error('NotFound: Course not found');
    }

    await courseToDelete.$query().softDelete();
    // This is bad, but deletion of courses will be a rare operation.
    // Optimize it to a raw query if nothing else is possible when we're there
    for (let m of courseToDelete.modules) {
      await m.$relatedQuery('topics').softDelete();
    }
    await courseToDelete.$relatedQuery('modules').softDelete();

    return courseToDelete;
  } catch (err) {
    logger.info('Error while creating new Course', err);

    throw err;
  }
};
