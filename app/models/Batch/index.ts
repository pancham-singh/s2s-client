import { JsonSchema, Model } from 'objection';
import BaseModel from '../BaseModel';
import TrainingCenter from '../TrainingCenter';
import User from '../User';
import Course from '../Course';

class Batch extends BaseModel {
  static tableName = 'batch';

  static jsonSchema: JsonSchema = {
    type: 'object',
    required: ['startDate', 'endDate'],

    properties: {
      name: { type: 'string' },
      startDate: { type: 'date' },
      endDate: { type: 'date' }
    }
  };

  static relationMappings = {
    trainingCenter: {
      relation: Model.BelongsToOneRelation,
      modelClass: TrainingCenter,
      join: {
        from: 'batch.training_center_id',
        to: 'training_center.id'
      }
    },
    users: {
      relation: Model.ManyToManyRelation,
      modelClass: User,
      join: {
        from: 'batch.id',
        to: 'user.id',
        through: {
          from: 'user_batches.user_id',
          extra: ['role'],
          to: 'user_batches.batch_id'
        }
      }
    },
    course: {
      relation: Model.BelongsToOneRelation,
      modelClass: Course,
      join: {
        from: 'batch.course_id',
        to: 'course.id'
      }
    }
  };

  name: string;
  startDate: Date;
  endDate: Date;
  users: User[];
  trainingCenter: TrainingCenter;
  course: Course;
}

export default Batch;
