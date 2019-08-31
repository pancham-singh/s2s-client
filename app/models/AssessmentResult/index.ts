import { JsonSchema, Model } from 'objection';
import BaseModel from '../BaseModel';
import Batch from '../Batch';
import Course from '../Course';
import Question, { default as Question } from '../Question';
import Topic from '../Topic';
import User from '../User';
import AssessmentAnswer from '../AssessmentAnswer/index';
import Assessment from '../Assessment/index';

class AssessmentResult extends BaseModel {
  static tableName = 'assessment_result';

  static jsonSchema: JsonSchema = {
    type: 'object',
    required: ['user'],

    properties: {
      user: { type: 'object' },
      assessment: { type: 'object' }
    }
  };

  static relationMappings = {
    answers: {
      relation: Model.HasManyRelation,
      modelClass: AssessmentAnswer,
      join: {
        from: 'assessment_result.id',
        to: 'assessment_answer.assessment_id'
      }
    },
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'assessment_result.user_id',
        to: 'user.id'
      }
    },
    assessment: {
      relation: Model.BelongsToOneRelation,
      modelClass: Assessment,
      join: {
        from: 'assessment_result.assessment_id',
        to: 'assessment.id'
      }
    }
  };
}

export default AssessmentResult;
