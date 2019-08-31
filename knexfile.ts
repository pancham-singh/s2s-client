// Update with your config settings.
import { db } from './app/config';
import { knexSnakeCaseMappers } from 'objection';

const conn = {
  client: 'mysql',
  debug: process.env.KNEX_DEBUG || false,
  connection: {
    host: db.host,
    database: db.name,
    user: db.user,
    password: db.password,
    typeCast: (field, next) => {
      if (field.type === 'TINY' && field.length === 1) {
        return field.string() === '1'; // 1 = true, 0 = false
      }
      return next();
    }
  },
  pool: {
    min: 2,
    max: 10,
    ping: (c, cb) => {
      c.query('SELECT 1', cb);
    }
  },
  ...knexSnakeCaseMappers
};

export const development = conn;
export const production = conn;
