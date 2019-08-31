import { JsonSchema, Model } from 'objection';
import BaseModel from '../BaseModel';
import Module from '../Module';

class Course extends BaseModel {
  static tableName = 'course';

  static jsonSchema: JsonSchema = {
    type: 'object',
    required: ['name', 'category'],

    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      icon: { type: 'string' },
      coverImage: { type: 'string' },
      category: { type: 'string', enum: ['domain', 'non-domain'] }
    }
  };

  static relationMappings = {
    modules: {
      relation: Model.HasManyRelation,
      modelClass: Module,
      join: {
        from: 'course.id',
        to: 'module.course_id'
      }
    }
  };

  name: string;
  description: string;
  icon: string;
  coverImage: string;
  modules: Module[];
  category: 'domain' | 'non-domain';
}

export default Course;
