import AssessmentResult from '../../models/AssessmentResult';

const eager = '[ user, assessment,answers ]';

const getAssessmentResults = async (_, args) => {
    const limit = args.limit || 20;
    const skip = args.skip || 0;

    return await AssessmentResult.query()
        .offset(skip)
        .limit(limit)
        .eager(eager)
        .orderBy('updated_at');
};

const getAssessmentResultDetails = async (_, { id }) => {
    return await AssessmentResult.query()
        .findById(id)
        .eager(eager)
        .orderBy('updated_at');
};

export default { getAssessmentResults, getAssessmentResultDetails };
