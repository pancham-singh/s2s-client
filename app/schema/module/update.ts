import { GqlContext } from '../../custom';
import Module from '../../models/Module';
import logger from '../../lib/logger';
import Course from '../../models/Course';

interface UpdateModuleInput {
  id: string;
  name?: string;
  description?: string;
  icon?: string;
  coverImage?: string;
  course?: string;
}

export default async (_, args: UpdateModuleInput, { user }: GqlContext) => {
  if (!user) {
    throw new Error('AccessDenied: You must be logged in to perform this operation');
  }

  if (!user.hasPermission('module:write')) {
    throw new Error('AuthorizationError: You are not allowed to perform this operation');
  }

  try {
    // fetch and hence check the validity of course before trying anything else
    let course;
    if (args.course) {
      course = await Course.query()
        .findById(args.course)
        .first();

      if (!course) {
        throw new Error('InvlaidCourse: Course for module does not exist');
      }
    }

    const moduleToUpdate = await Module.query()
      .where('id', '=', args.id)
      .first();

    if (!moduleToUpdate) {
      throw new Error('NotFound: Module not found');
    }

    const patch = {
      name: args.name,
      description: args.description,
      icon: args.icon,
      coverImage: args.coverImage
    };

    if (course) {
      patch.courseId = course.id;
    }

    await moduleToUpdate
      .$query()
      .skipUndefined()
      .patch(patch);

    return await moduleToUpdate.$query().eager('course');
  } catch (err) {
    logger.info('Error while updating Module', err);

    if (/duplicate entry/i.test(err.message)) {
      throw new Error(`DuplicateEntry: There is already a module with name ${args.name}`);
    }

    throw err;
  }
};
