import Course from '../../models/Course';

const getCourses = async (_, { limit, skip }) => {
  limit = limit || 20;
  skip = skip || 0;

  return await Course.query()
    .offset(skip)
    .limit(limit)
    .eager('modules')
    .orderBy('updated_at');
};

const getCourseDetails = async (_, { id, topics }) => {
  topics = topics || {};

  return await Course.query()
    .findById(id)
    .eager('modules')
    .orderBy('updated_at');
};

export default { getCourses, getCourseDetails };
