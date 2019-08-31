import { JsonSchema, Model } from 'objection';
import Module from '../Module';
import BaseModel from '../BaseModel';
import Question from '../Question';

class Topic extends BaseModel {
  static tableName = 'topic';

  static jsonSchema: JsonSchema = {
    type: 'object',
    required: ['name'],

    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      icon: { type: 'string' },
      coverImage: { type: 'string' },
      pointsPractical: { type: 'integer' },
      pointsTheory: { type: 'integer' }
    }
  };

  name: string;
  description: string;
  icon: string;
  coverImage: string;
  pointsPractical: number;
  pointsTheory: number;
  module: Module;
  questions: Question[];

  static get relationMappings() {
    return {
      module: {
        relation: Model.BelongsToOneRelation,
        modelClass: require('../Module').default,
        join: {
          from: 'topic.module_id',
          to: 'module.id'
        }
      },
      questions: {
        relation: Model.HasManyRelation,
        modelClass: require('../Question').default,
        join: {
          from: 'topic.id',
          to: 'question.topic_id'
        }
      }
    };
  }
}

export default Topic;
