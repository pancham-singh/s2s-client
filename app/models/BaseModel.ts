import { Model, snakeCaseMappers, JsonSchema, QueryBuilder } from 'objection';
import SoftDeleteQueryBuilder from './SoftDeleteQueryBuilder';
import knex from '../db';

Model.knex(knex);

class BaseModel extends Model {
  static columnNameMappers = snakeCaseMappers();
  static QueryBuilder = SoftDeleteQueryBuilder;

  static jsonSchema: JsonSchema = {
    type: 'object',

    properties: {
      id: { type: 'integer' },
      createdAt: { type: 'timestamp' },
      updatedAt: { type: 'timestamp' },
      deletedAt: { type: 'timestamp' }
    }
  };

  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export default BaseModel;
