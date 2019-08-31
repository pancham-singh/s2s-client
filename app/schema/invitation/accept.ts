import User from '../../models/User';
import { isProduction } from '../../config';
import { comparePasswords } from '../../lib/passwords';
import { GqlContext } from '../../custom';
import roles from '../../bootstrap/roles';
import logger from '../../lib/logger';
import Invitation from '../../models/Invitation';
import TrainingCenter from '../../models/TrainingCenter';
import Role from '../../models/Role';

interface MutationInput {
  token: string;
}

const acceptInvitation = async (_, { token }: MutationInput, { user }: GqlContext) => {
  try {
    const invite = await Invitation.query()
      .findOne({ token })
      .eager('[ trainingCenter, batch ]')
      .andWhere((b) => b.where('valid_till', '>=', new Date()).orWhereNull('valid_till'));

    if (!invite) {
      throw new Error('InvalidInvitationToken: Invitation token is not valid');
    }

    const newRole = await Role.query().findOne({ name: invite.invitedAs });
    // User can have a single role for now
    await user.$relatedQuery('roles').unrelate();
    await user.$relatedQuery('roles').relate([newRole]);

    const updatedUser = await User.query()
      .findById(user.id)
      .eager('[ roles, roles.permissions]');

    if (invite.invitedAs === 'centerIncharge') {
      try {
        const trainingCenterToUpdate = invite.trainingCenter;

        // Because there can only be one incharge of a center at one point in time
        await trainingCenterToUpdate.$relatedQuery('incharges').unrelate();
        await trainingCenterToUpdate.$relatedQuery('incharges').relate([updatedUser]);
      } catch (err) {
        logger.info('Errror while updating training-center of invited user', err);
        throw err;
      }
    }

    if ((invite.invitedAs === 'student' || invite.invitedAs === 'teacher') && invite.batch) {
      const batch = invite.batch;

      await batch.$relatedQuery('users').relate({ id: updatedUser.id, role: invite.invitedAs });
    }

    return {
      token: updatedUser.authenticate(),
      user: updatedUser
    };
  } catch (err) {
    logger.info('Error while accepting invitation', err);

    if (isProduction) {
      throw new Error('Something went wrong while accepting invitation');
    } else {
      throw err;
    }
  }
};

export default acceptInvitation;
