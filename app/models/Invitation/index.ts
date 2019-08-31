import { JsonSchema, Model } from 'objection';
import BaseModel from '../BaseModel';
import User from '../User';
import Batch from '../Batch';
import TrainingCenter from '../TrainingCenter';
import { sendMail } from '../../services/email';
import logger from '../../lib/logger';
import { baseHostname } from '../../config';

class Invitation extends BaseModel {
  static tableName = 'invitation';

  static jsonSchema: JsonSchema = {
    type: 'object',
    required: ['token', 'invitedEmail', 'invitedAs'],

    properties: {
      token: { type: 'string' },
      invitedEmail: { type: 'string' },
      invitedAs: { type: 'string', enum: ['student', 'teacher', 'centerIncharge', 'pia', 'admin'] }
    }
  };

  static get relationMappings() {
    return {
      invitedBy: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'invitation.invited_by_id',
          to: 'user.id'
        }
      },
      batch: {
        relation: Model.BelongsToOneRelation,
        modelClass: Batch,
        join: {
          from: 'invitation.batch_id',
          to: 'batch.id'
        }
      },
      trainingCenter: {
        relation: Model.BelongsToOneRelation,
        modelClass: TrainingCenter,
        join: {
          from: 'invitation.training_center_id',
          to: 'training_center.id'
        }
      }
    };
  }

  sendInvitationEmail = async () => {
    let role;

    switch (this.invitedAs) {
      case 'teacher':
        role = 'Teacher';
        break;
      case 'centerIncharge':
        role = 'Training Center Incharge';
        break;
      case 'student':
        role = 'Student';
        break;
    }

    const acceptLink = `http://${baseHostname}/accept-invitation/${this.token}`;

    await sendMail({
      to: this.invitedEmail,
      from: `invites@${baseHostname}`,
      subject: 'Invitation to join Skill2Skills!',
      html: `
      <p>Hello there,<p>
      <p>You have been invited to join Skill2SKills as a <b>${role}</b> by ${
        this.invitedBy.name
      }.</p>
      <p>You can <a href='${acceptLink}'>click here to acccept the invitation</a>.</p>
      <br />
      <p>---</p>
      <p>Thank you,</p>
      <p>Team Skill2Skills</p>
      `
    });
  };

  token: string;
  invitedEmail: string;
  invitedBy: User;
  invitedAs: string;
  validTill: Date;
  batch: Batch;
  trainingCenter: TrainingCenter;
}

export default Invitation;
