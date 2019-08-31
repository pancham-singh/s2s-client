import * as config from '../knexfile';
import * as Knex from 'knex';

const env = process.env.NODE_ENV || 'development';
const knex = Knex(config[env]);

export default knex;
