import { JsonSchema, Model } from 'objection';
import BaseModel from '../BaseModel';
import Batch from '../Batch';
import Course from '../Course';
import Question, { default as Question } from '../Question';
import Topic from '../Topic';
import User from '../User';
import Attachment from '../Attachment/index';

class AssessmentAnswer extends BaseModel {
  static tableName = 'assessment_answer';

  static jsonSchema: JsonSchema = {
    type: 'object',
    required: ['body'],

    properties: {
        body: { type: 'string' },
        answerId: { type: 'string' },
        isCorrect: { type: 'boolean' }
    }
  };

  static relationMappings = {
    question: {
      relation: Model.BelongsToOneRelation,
      modelClass: Question,
      join: {
        from: 'assessment_answer.question_id',
        to: 'question.id'
      }
    },
      attachments: {
          relation: Model.HasManyRelation,
          modelClass: Attachment,
          join: {
              from: 'assessment_answer.answer_id',
              to: 'attachment.answer_id'
          }
      }
  };
  answerId:number;
  body: string;
  isCorrect: Boolean;
  question?: Question;
  attachments: Attachment[];
}

export default AssessmentAnswer;
