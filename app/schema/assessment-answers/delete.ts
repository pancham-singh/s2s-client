import { GqlContext } from '../../custom';
import AssessmentAnswer from '../../models/AssessmentAnswer';
import logger from '../../lib/logger';

interface DeleteAnswerInput {
    id: string;
}

export default async (_, args: DeleteAnswerInput, { user }: GqlContext) => {
    if (!user) {
        throw new Error('AccessDenied: You must be logged in to perform this operation');
    }

    if (!user.hasPermission('answer:delete')) {
        throw new Error('AuthorizationError: You are not allowed to perform this operation');
    }

    try {
        const answerToDelete = await AssessmentAnswer.query()
            .eager('[ attachments ]')
            .findById(args.id);

        if (!answerToDelete) {
            throw new Error('NotFound: Answer not found');
        }

        await answerToDelete.$query().softDelete();

        return answerToDelete;
    } catch (err) {
        logger.info('Error while deleting new Answer', err);

        throw err;
    }
};
