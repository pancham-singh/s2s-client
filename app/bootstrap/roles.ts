import * as Knex from 'knex';
import permissions from './permissions';

const roles = [
  {
    id: 1,
    name: 'admin',
    description: 'Has all the permissions. Can do everything.',
    permissions: permissions.map((p) => p.id)
  },
  {
    id: 2,
    name: 'pia',
    description: 'Can create and manage training centers',
    permissions: permissions
      .filter((p) =>
        [
          'trainingCenter:read:own',
          'trainingCenter:write:own',
          'trainingCenter:delete:own',
          'batch:read:own',
          'batch:write:own',
          'batch:delete:own',
          'invitation:read:own',
          'invitation:write:own',
          'invitation:delete:own',
          'user:read:own',
          'user:write:own',
          'user:delete:own'
        ].includes(p.name)
      )
      .map((p) => p.id)
  },
  {
    id: 3,
    name: 'centerIncharge',
    description: 'Manage a training center',
    permissions: permissions
      .filter((p) =>
        [
          'batch:read:own',
          'batch:write:own',
          'batch:delete:own',
          'invitation:read:own',
          'invitation:write:own',
          'invitation:delete:own',
          'user:read:own',
          'user:write:own',
          'user:delete:own'
        ].includes(p.name)
      )
      .map((p) => p.id)
  },
  {
    id: 4,
    name: 'teacher',
    description: 'Manage a batch',
    permissions: permissions
      .filter((p) =>
        [
          'course:read',
          'assessment:read',
          'batch:read:own',
          'batch:write:own',
          'batch:delete:own',
          'invitation:read:own',
          'invitation:write:own',
          'invitation:delete:own',
          'user:read:own',
          'user:write:own',
          'user:delete:own'
        ].includes(p.name)
      )
      .map((p) => p.id)
  },
  {
    id: 5,
    name: 'student',
    description: 'Can view courses, give assessments and participate in batches',
    permissions: permissions
      .filter((p) => ['course:read', 'assessment:read'].includes(p.name))
      .map((p) => p.id)
  }
];

export const createRoles = async (knex: Knex): Promise<any> => {
  const createRole = async (role) => {
    const table = knex('role');

    const existingRole = await table
      .select()
      .where('id', '=', role.id)
      .first();

    if (existingRole) {
      await knex('role')
        .where('id', '=', role.id)
        .update({ id: role.id, name: role.name, description: role.description });
    } else {
      await table.insert({ id: role.id, name: role.name, description: role.description });
    }

    await knex('role_permissions')
      .delete()
      .where('role_id', '=', role.id);
    for (const permissionId of role.permissions) {
      await knex('role_permissions').insert({ role_id: role.id, permission_id: permissionId });
    }
  };

  for (const role of roles) {
    try {
      await createRole(role);
    } catch (err) {
      console.warn(`Failed to create role: ${role.name}`, err);
    }
  }
};

export default roles;
