import { JsonSchema, Model } from 'objection';
import BaseModel from '../BaseModel';
import Question from '../Question';
import Answer from '../Answer';

class Attachment extends BaseModel {
  static tableName = 'attachment';

  static jsonSchema: JsonSchema = {
    type: 'object',
    required: ['url', 'type'],

    properties: {
      url: { type: 'string' },
      type: { type: 'string', enum: ['image', 'video', 'audio'] }
    }
  };

  static get relationMappings() {
    return {
      question: {
        relation: Model.BelongsToOneRelation,
        modelClass: require('../Question').default,
        join: {
          from: 'attachment.question_id',
          to: 'question.id'
        }
      },
      answer: {
        relation: Model.BelongsToOneRelation,
        modelClass: require('../Answer').default,
        join: {
          from: 'attachment.answer_id',
          to: 'answer.id'
        }
      }
    };
  }

  url: string;
  type: 'image' | 'video' | 'audio';
  question?: Question;
  answer?: Answer;
}

export interface AttachmentInput {
  id?: string;
  url: string;
  type: 'image' | 'video' | 'audio';
}

export default Attachment;
