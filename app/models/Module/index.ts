import { JsonSchema, Model } from 'objection';
import Course from '../Course';
import BaseModel from '../BaseModel';
import Topic from '../Topic';

class Module extends BaseModel {
  static tableName = 'module';

  static jsonSchema: JsonSchema = {
    type: 'object',
    required: ['name'],

    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      coverImage: { type: 'string' },
      icon: { type: 'string' }
    }
  };

  name: string;
  description: string;
  icon: string;
  coverImage: string;
  course: Course;
  topics: Topic[];

  static get relationMappings() {
    return {
      topics: {
        relation: Model.HasManyRelation,
        modelClass: Topic,
        join: {
          from: 'topic.module_id',
          to: 'module.id'
        }
      },
      course: {
        relation: Model.BelongsToOneRelation,
        modelClass: require('../Course').default,
        join: {
          from: 'module.course_id',
          to: 'course.id'
        }
      }
    };
  }
}

export default Module;
