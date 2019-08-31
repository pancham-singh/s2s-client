import Assessment from '../../models/Assessment';

const eager = '[ questions, topics, createdBy ]';

const getAssessments = async (_, args) => {
  const limit = args.limit || 20;
  const skip = args.skip || 0;

  return await Assessment.query()
    .offset(skip)
    .limit(limit)
    .eager(eager)
    .orderBy('updated_at');
};

const getAssessmentDetails = async (_, { id }) => {
  return await Assessment.query()
    .findById(id)
    .eager(eager)
    .orderBy('updated_at');
};

export default { getAssessments, getAssessmentDetails };
