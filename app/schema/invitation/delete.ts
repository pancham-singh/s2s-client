import { GqlContext } from '../../custom';
import Invitation from '../../models/Invitation';
import logger from '../../lib/logger';

interface DeleteInvitationInput {
  id: string;
}

export default async (_, args: DeleteInvitationInput, { user }: GqlContext) => {
  try {
    const invitationToDelete = await Invitation.query()
      .eager('[ trainingCenter, batch ]')
      .findById(args.id);

    if (!invitationToDelete) {
      throw new Error('NotFound: Invitation not found');
    }

    await invitationToDelete.$query().softDelete();

    return invitationToDelete;
  } catch (err) {
    logger.info('Error while deleting Invitation', err);

    throw err;
  }
};
