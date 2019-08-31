import { JsonSchema, Model } from 'objection';
import BaseModel from '../BaseModel';
import Course from '../Course';
import Topic from '../Topic';
import User from '../User';
import Batch from '../Batch';
import Question, {default as Question} from '../Question';

class Assessment extends BaseModel {
  static tableName = 'assessment';

  static jsonSchema: JsonSchema = {
    type: 'object',
    required: ['durationMinutes'],

    properties: {
      name: { type: 'string' },
      startDate: { type: 'date' },
      endDate: { type: 'date' },
      durationMinutes: { type: 'integer' }
    }
  };

  static relationMappings = {
    batch: {
      relation: Model.BelongsToOneRelation,
      modelClass: Batch,
      join: {
        from: 'assessment.batch_id',
        to: 'batch.id'
      }
    },
    topics: {
      relation: Model.ManyToManyRelation,
      modelClass: Topic,
      join: {
        from: 'assessment.id',
        to: 'topic.id',
        through: {
          from: 'assessment_topics.assessment_id',
          to: 'assessment_topics.topic_id'
        }
      }
    },
    questions: {
      relation: Model.ManyToManyRelation,
      modelClass: Question,
      join: {
        from: 'assessment.id',
        to: 'question.id',
        through: {
          from: 'assessment_questions.assessment_id',
          to: 'assessment_questions.question_id'
        }
      }
    },
    createdBy: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'assessment.created_by_id',
        to: 'user.id'
      }
    }
  };

  name: string;
  durationMinutes: number;
  startDate: Date;
  endDate: Date;
  topics: Topic[];
}

export default Assessment;
