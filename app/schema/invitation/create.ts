import { GqlContext } from '../../custom';
import { createHash } from 'crypto';
import Invitation from '../../models/Invitation';
import logger from '../../lib/logger';
import TrainingCenter from '../../models/TrainingCenter';
import Batch from '../../models/Batch';

interface CreateInvitationInput {
  invitedEmail: string;
  invitedAs: 'student' | 'teacher' | 'centerIncharge';
  validTill: string;
  trainingCenter: string;
  batch: string;
}

const tokenForString = (str: string): string => {
  const shasum = createHash('sha1');

  shasum.update(`${new Date().getTime()}${str}`);

  return shasum.digest('hex');
};

export default async (_, args: CreateInvitationInput, { user }: GqlContext) => {
  const eager = '[ invitedBy, trainingCenter, batch ]';
  const token = tokenForString(args.invitedEmail);

  try {
    let batch;
    const trainingCenter = await TrainingCenter.query().findById(args.trainingCenter);

    if (!trainingCenter) {
      throw new Error('InvalidTrainingCenter: Training center not found');
    }

    if (args.batch) {
      batch = await Batch.query().findById(args.batch);

      if (!batch) {
        throw new Error('InvalidBatch: Batch not found');
      }
    }

    let invitation = await Invitation.query()
      .eager(eager)
      .findOne('invited_email', '=', args.invitedEmail)
      .andWhere((builder) =>
        builder.where('valid_till', '<', new Date()).orWhereNull('valid_till')
      );

    if (invitation && invitation.invitedAs !== args.invitedAs) {
      const discardedInvitation = await invitation
        .$query()
        .eager(eager)
        .patchAndFetch({
          validTill: new Date()
        });

      logger.info(
        `Discarding previous invitation to ${args.invitedEmail} as ${
          args.invitedAs
        } for creating new invitation as ${args.invitedAs}`
      );

      invitation = null;
    }

    if (!invitation) {
      invitation = await Invitation.query()
        .skipUndefined()
        .eager(eager)
        .insertAndFetch({
          token,
          invitedEmail: args.invitedEmail,
          invitedAs: args.invitedAs,
          invitedById: user.id,
          validTill: args.validTill ? new Date(args.validTill) : undefined,
          trainingCenterId: trainingCenter.id,
          batchId: batch ? batch.id : undefined
        });
    }

    invitation
      .sendInvitationEmail()
      .then((res) =>
        logger.info(
          `Successfully sent invitation mail to: ${args.invitedEmail} as ${args.invitedAs}`
        )
      )
      .catch((err) => {
        logger.error(
          `Failed to send invitation mail to: ${args.invitedEmail} as ${args.invitedAs}`
        );
        logger.error(err);
      });

    return invitation;
  } catch (err) {
    logger.info('Error while creating new Invitation', err);

    if (/duplicate entry/i.test(err.message)) {
      throw new Error(`DuplicateEntry: There is already an invitation for ${args.invitedEmail}`);
    }

    throw err;
  }
};
