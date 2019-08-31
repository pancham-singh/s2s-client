import { GqlContext } from '../../custom';
import Attachment from '../../models/Attachment';
import logger from '../../lib/logger';

interface DeleteAttachmentInput {
  id: string;
}

export default async (_, args: DeleteAttachmentInput, { user }: GqlContext) => {
  if (!user) {
    throw new Error('AccessDenied: You must be logged in to perform this operation');
  }

  if (!user.hasPermission('attachment:delete')) {
    throw new Error('AuthorizationError: You are not allowed to perform this operation');
  }

  try {
    const attachmentToDelete = await Attachment.query()
      .eager('[ answer, question ]')
      .findById(args.id);

    if (!attachmentToDelete) {
      throw new Error('NotFound: Attachment not found');
    }

    await attachmentToDelete.$query().softDelete();

    return attachmentToDelete;
  } catch (err) {
    logger.info('Error while creating new Attachment', err);

    throw err;
  }
};
