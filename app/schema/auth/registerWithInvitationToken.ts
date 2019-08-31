import User from '../../models/User';
import { isProduction } from '../../config';
import { comparePasswords } from '../../lib/passwords';
import { GqlContext } from '../../custom';
import roles from '../../bootstrap/roles';
import logger from '../../lib/logger';
import Invitation from '../../models/Invitation';
import TrainingCenter from '../../models/TrainingCenter';

interface MutationInput {
  token: string;
  name: string;
  password: string;
}

const createUser = async (_, { token, password, name }: MutationInput, { user }: GqlContext) => {
  try {
    const invite = await Invitation.query()
      .findOne({ token })
      .eager('[ trainingCenter, batch ]')
      .andWhere((b) => b.where('valid_till', '>=', new Date()).orWhereNull('valid_till'));

    if (!invite) {
      throw new Error('InvalidInvitationToken: Invitation token is not valid');
    }

    const newUser = await User.createNew({
      email: invite.invitedEmail,
      password,
      name,
      roles: [invite.invitedAs]
    });

    if (invite.invitedAs === 'centerIncharge') {
      try {
        const trainingCenterToUpdate = invite.trainingCenter;

        await trainingCenterToUpdate.$relatedQuery('incharges').unrelate();
        await trainingCenterToUpdate.$relatedQuery('incharges').relate([newUser]);
      } catch (err) {
        logger.info('Errror while updating training-center of invited user', err);
        throw err;
      }
    }

    if ((invite.invitedAs === 'student' || invite.invitedAs === 'teacher') && invite.batch) {
      const batch = invite.batch;

      await batch.$relatedQuery('users').relate({ id: newUser.id, role: invite.invitedAs });
    }

    return {
      token: newUser.authenticate(),
      user: newUser
    };
  } catch (err) {
    logger.info(err);

    if (isProduction) {
      throw new Error('Something went wrong while registering with invitation');
    } else {
      throw err;
    }
  }
};

export default createUser;
