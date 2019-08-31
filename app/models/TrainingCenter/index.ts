import { JsonSchema, Model } from 'objection';
import BaseModel from '../BaseModel';
import User from '../User';

class TrainingCenter extends BaseModel {
  static tableName = 'training_center';

  static jsonSchema: JsonSchema = {
    type: 'object',
    required: ['name'],

    properties: {
      name: { type: 'string' },
      address: { type: 'string' }
    }
  };

  static relationMappings = {
    pia: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'training_center.pia_id',
        to: 'user.id'
      }
    },
    incharges: {
      relation: Model.ManyToManyRelation,
      modelClass: User,
      join: {
        from: 'training_center.id',
        to: 'user.id',
        through: {
          from: 'training_center_incharges.training_center_id',
          to: 'training_center_incharges.user_id'
        }
      }
    }
  };

  name: string;
  address: string;
  pia: User;
  incharges: User[];
}

export default TrainingCenter;
