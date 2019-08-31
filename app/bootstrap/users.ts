import * as Knex from 'knex';
import logger from '../lib/logger';
import { hashPassword } from '../lib/passwords';
import roles from './roles';

const superUsers = [
  {
    name: 'Root',
    profile_pic: null,
    email: 'superuser@skill2skills.com',
    password: 'superbatman'
  }
];

export const createUsers = async (knex: Knex): Promise<any> => {
  for (const user of superUsers) {
    const userRoles = roles.filter((r) => r.name === 'admin');
    let userId;
    user.password = await hashPassword(user.password);

    const existingUser = await knex('user')
      .select()
      .where('email', '=', user.email)
      .first();

    if (existingUser) {
      userId = await knex('user')
        .update(user)
        .where('email', '=', user.email);
    } else {
      userId = await knex('user').insert(user);
    }

    // User roles
    await knex('user_roles')
      .where('user_id', '=', userId)
      .del();
    for (const role of userRoles) {
      await knex('user_roles').insert({ user_id: userId, role_id: role.id });
    }
  }
};

export default superUsers;
