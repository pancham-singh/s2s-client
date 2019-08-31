import { JsonSchema, Model, snakeCaseMappers } from 'objection';
import { sign } from 'jsonwebtoken';
import { flatten } from 'ramda';
import Role from '../Role';
import { jwtSecret, isProduction } from '../../config';
import BaseModel from '../BaseModel';
import Permission from '../../models/Permission';
import { isStrongPassword, hashPassword } from '../../lib/passwords';

class User extends BaseModel {
  static tableName = 'user';
  static columnNameMappers = snakeCaseMappers();

  static jsonSchema: JsonSchema = {
    type: 'object',
    required: ['email'],

    properties: {
      email: { type: 'string' },
      password: { type: 'string' },
      name: { type: 'string' },
      profilePic: { type: 'string' }
    }
  };

  static relationMappings = {
    roles: {
      relation: Model.ManyToManyRelation,
      modelClass: Role,
      join: {
        from: 'user.id',
        to: 'role.id',
        through: {
          from: 'user_roles.user_id',
          to: 'user_roles.role_id'
        }
      }
    }
  };

  email: string;
  password: string;
  name: string;
  profilePic: string;
  roles: Role[];

  get permissions() {
    const roles = this.roles || [];
    const userPermissions = flatten(roles.map((r) => r.permissions));

    return userPermissions as any;
  }

  hasPermission(permission: Permission | string): boolean {
    const pName = typeof permission === 'string' ? permission : permission.name;

    return Boolean(this.permissions.find((p) => p.name === pName));
  }

  hasRole(role: Role | string): boolean {
    const roleName = typeof role === 'string' ? role : role.name;

    return Boolean(this.roles.find((r) => r.name === roleName));
  }

  static async createNew({
    email,
    password,
    name,
    roles
  }: {
    email: string;
    password: string;
    name: string;
    roles: string[];
  }): Promise<User> {
    // Make sure there isn't already a user with provided email
    try {
      const existingUser = await User.query()
        .where('email', '=', email)
        .select('id')
        .first();

      if (existingUser) {
        throw new Error(`DuplicateEmail: ${email}`);
      }
    } catch (err) {
      throw err;
    }

    // Make sure password is strong enough
    const validPassword = await isStrongPassword(password);
    if (!validPassword) {
      throw new Error('WeakPassword: Password is too weak');
    }

    let userRoles: Role[];
    try {
      userRoles = await Role.query().where('name', 'in', roles);

      if (userRoles.length !== roles.length) {
        throw new Error(
          `Invalid role id(s): ${roles.filter(
            (i: string) => !userRoles.find((p) => String(p.id) === i)
          )}}`
        );
      }
    } catch (err) {
      throw err;
    }

    const encryptedPassword = await hashPassword(password);
    const newUser = await User.query()
      .skipUndefined()
      .eager('roles.permissions')
      .insertGraph(
        {
          name,
          email,
          password: encryptedPassword,
          roles: userRoles
        },
        { relate: true }
      );

    return newUser;
  }

  authenticate() {
    if (!this.id) {
      throw new Error('Insufficient data on user for creating JWT token');
    }

    return sign({ id: this.id, updatedAt: this.updatedAt }, jwtSecret, {
      expiresIn: '7d'
    });
  }
}

export default User;
