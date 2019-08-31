import { JsonSchema, Model } from 'objection';
import BaseModel from '../BaseModel';
import Question from '../Question';
import Attachment from '../Attachment';

class Answer extends BaseModel {
  static tableName = 'answer';

  static jsonSchema: JsonSchema = {
    type: 'object',
    required: ['body', 'isCorrect'],

    properties: {
      body: { type: 'string' },
      isCorrect: { type: 'boolean' }
    }
  };

  static get relationMappings() {
    return {
      question: {
        relation: Model.BelongsToOneRelation,
        modelClass: require('../Question').default,
        join: {
          from: 'answer.question_id',
          to: 'question.id'
        }
      },
      attachments: {
        relation: Model.HasManyRelation,
        modelClass: Attachment,
        join: {
          from: 'answer.id',
          to: 'attachment.answer_id'
        }
      }
    };
  }

  body: string;
  question: Question;
  isCorrect: boolean;
  attachments: Attachment[];
}

export default Answer;
