import { GqlContext } from '../../custom';
import Course from '../../models/Course';
import Permission from '../../models/Permission';
import logger from '../../lib/logger';

interface UpdateCourseInput {
  id: string;
  name: string;
  category: 'domain' | 'non-domain';
  description: string;
  icon?: string;
  coverImage?: string;
}

export default async (_, args: UpdateCourseInput, { user }: GqlContext) => {
  if (!user) {
    throw new Error('AccessDenied: You must be logged in to perform this operation');
  }

  if (!user.hasPermission('course:write')) {
    throw new Error('AuthorizationError: You are not allowed to perform this operation');
  }

  try {
    const updatedCourse = await Course.query()
      .skipUndefined()
      .eager('modules')
      .patchAndFetchById(args.id, {
        name: args.name,
        description: args.description,
        category: args.category,
        icon: args.icon,
        coverImage: args.coverImage
      });

    // there was nothing to update, but we still need to return the course
    if (!updatedCourse) {
      return await Course.query()
        .eager('modules')
        .where('id', '=', args.id)
        .first();
    }

    return updatedCourse;
  } catch (err) {
    logger.info('Error while Updating Course', err);

    if (/duplicate entry/i.test(err.message)) {
      throw new Error(`DuplicateEntry: There is already a course with name ${args.name}`);
    }

    throw err;
  }
};
