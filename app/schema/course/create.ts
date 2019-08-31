import { GqlContext } from '../../custom';
import Course from '../../models/Course';
import Permission from '../../models/Permission';
import logger from '../../lib/logger';

interface CreateCourseInput {
  name: string;
  description: string;
  category: 'domain' | 'non-domain';
  icon?: string;
  coverImage?: string;
}

export default async (_, args: CreateCourseInput, { user }: GqlContext) => {
  if (!user) {
    throw new Error('AccessDenied: You must be logged in to perform this operation');
  }

  if (!user.hasPermission('course:write')) {
    throw new Error('AuthorizationError: You are not allowed to perform this operation');
  }

  try {
    const newCourse = await Course.query().insertGraphAndFetch({
      name: args.name,
      description: args.description,
      category: args.category,
      icon: args.icon,
      coverImage: args.coverImage
    });

    return newCourse;
  } catch (err) {
    logger.info('Error while creating new Course', err);

    throw err;
  }
};
