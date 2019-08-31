import { GqlContext } from '../../custom';
import Attachment from '../../models/Attachment';
import logger from '../../lib/logger';
import { AttachmentInput } from '../../models/Attachment';

interface UpdateAttachmentInput {
  id: string;
  url?: string;
  type?: boolean;
}

export default async (_, args: UpdateAttachmentInput, { user }: GqlContext) => {
  if (!user) {
    throw new Error('AccessDenied: You must be logged in to perform this operation');
  }

  if (!user.hasPermission('attachment:write')) {
    throw new Error('AuthorizationError: You are not allowed to perform this operation');
  }

  try {
    const attachmentToUpdate = await Attachment.query()
      .where('id', '=', args.id)
      .first();

    if (!attachmentToUpdate) {
      throw new Error('NotFound: Attachment not found');
    }

    const patch = {
      url: args.url,
      type: args.type
    };

    await attachmentToUpdate
      .$query()
      .skipUndefined()
      .patch(patch);

    return await attachmentToUpdate.$query().eager('[ question, answer ]');
  } catch (err) {
    logger.info('Error while updating Attachment', err);

    if (/duplicate entry/i.test(err.message)) {
      throw new Error(`DuplicateEntry: There is already a attachment with name ${args.name}`);
    }

    throw err;
  }
};
