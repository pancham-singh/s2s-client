import { JsonSchema, Model } from 'objection';
import Permission from '../Permission';
import BaseModel from '../BaseModel';

class Role extends BaseModel {
  static tableName = 'role';

  static jsonSchema: JsonSchema = {
    type: 'object',
    required: ['name'],

    properties: {
      name: { type: 'string' },
      description: { type: 'string' }
    }
  };

  static relationMappings = {
    permissions: {
      relation: Model.ManyToManyRelation,
      modelClass: Permission,
      join: {
        from: 'role.id',
        to: 'permission.id',
        through: {
          from: 'role_permissions.role_id',
          to: 'role_permissions.permission_id'
        }
      }
    }
  };

  name: string;
  description: string;
  permissions: Permission[];
}

export default Role;
