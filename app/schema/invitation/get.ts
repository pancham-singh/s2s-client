import Invitation from '../../models/Invitation';
import { GqlContext } from '../../custom';

const eager = '[ invitedBy, batch, trainingCenter ]';

const getInvitations = async (_, args, { user }: GqlContext) => {
  const limit = args.limit || 20;
  const skip = args.skip || 0;

  return await Invitation.query()
    .where({ invited_by_id: user.id })
    .offset(skip)
    .limit(limit)
    .eager(eager)
    .orderBy('updated_at');
};

const getInvitationDetails = async (_, { id, token, invitedEmail }) => {
  if (id) {
    return await Invitation.query()
      .findById(id)
      .eager(eager);
  }

  if (token) {
    return await Invitation.query()
      .findOne({ token })
      .eager(eager);
  }

  if (invitedEmail) {
    return await Invitation.query()
      .findOne({ invitedEmail })
      .eager(eager);
  }
};

const getInvitationForToken = async (_, { token }) => {
  return await Invitation.query()
    .findOne({ token })
    .eager(eager);
};

export default { getInvitations, getInvitationDetails, getInvitationForToken };
