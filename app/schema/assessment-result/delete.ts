import { GqlContext } from '../../custom';
import Assessment from '../../models/Assessment';
import logger from '../../lib/logger';
import AssessmentResult from '../../models/AssessmentResult';

interface DeleteAssessmentResultInput {
    id: string;
}

const eager = '[ questions, assessment_answer,assessment, user ]';

export default async (_, args: DeleteAssessmentResultInput, { user }: GqlContext) => {
    try {
        const assessmentResultToDelete = await AssessmentResult.query()
            .eager(eager)
            .findById(args.id);

        if (!assessmentResultToDelete) {
            throw new Error('NotFound: Assessment Result not found');
        }

        await assessmentResultToDelete.$query().softDelete();

        return assessmentResultToDelete;
    } catch (err) {
        logger.info('Error while deleting new Assessment Result', err);

        throw err;
    }
};
