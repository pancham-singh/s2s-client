import { JsonSchema, Model } from 'objection';
import BaseModel from '../BaseModel';

class Permission extends BaseModel {
  static tableName = 'permission';

  static jsonSchema: JsonSchema = {
    type: 'object',
    required: ['name'],

    properties: {
      name: { type: 'string' },
      description: { type: 'string' }
    }
  };

  name: string;
  description: string;
}

export default Permission;
