import { JsonSchema, Model } from 'objection';
import BaseModel from '../BaseModel';
import Answer from '../Answer';
import Attachment from '../Attachment';
import Topic from '../Topic';

class Question extends BaseModel {
  static tableName = 'question';

  static jsonSchema: JsonSchema = {
    type: 'object',
    required: ['body', 'points', 'type'],

    properties: {
      body: { type: 'string' },
      points: { type: 'integer' },
      type: { type: 'string', enum: ['practical', 'theory'] }
    }
  };

  static get relationMappings() {
    return {
      answers: {
        relation: Model.HasManyRelation,
        modelClass: require('../Answer').default,
        join: {
          from: 'question.id',
          to: 'answer.question_id'
        }
      },
      attachments: {
        relation: Model.HasManyRelation,
        modelClass: require('../Attachment').default,
        join: {
          from: 'question.id',
          to: 'attachment.question_id'
        }
      },
      topic: {
        relation: Model.BelongsToOneRelation,
        modelClass: Topic,
        join: {
          from: 'question.topic_id',
          to: 'topic.id'
        }
      }
    };
  }

  body: string;
  points: number;
  type: 'practical' | 'theory';
  answers: Answer[];
  attachments: Attachment[];
  topic: Topic;
}

export default Question;
