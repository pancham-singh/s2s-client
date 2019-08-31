import * as Knex from 'knex';
import { existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';

import { createPermissions } from './permissions';
import { createRoles } from './roles';
import { createUsers } from './users';
import { isProduction } from '../config';
import knex from '../db';
import logger from '../lib/logger';

const shallBootstrapFile = resolve('.done-bootstrapping');

export const bootstrap = async () => {
  try {
    logger.info('Running migrations');
    await knex.migrate.latest();

    logger.info('Creating permissions');
    await createPermissions(knex);

    logger.info('Creating roles');
    await createRoles(knex);

    logger.info('Creating users');
    await createUsers(knex);

    writeFileSync(shallBootstrapFile, '');
    logger.info('Done bootstrapping!');
  } catch (err) {
    console.error('Error while bootstraping.', err);
  }
};

export const shallBootstrap = () => {
  return !existsSync(shallBootstrapFile);
};
