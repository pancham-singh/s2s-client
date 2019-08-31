import * as jwt from 'express-jwt';
import * as session from 'express-session';
import * as redisStore from 'connect-redis';
import { Response, NextFunction } from 'express';

import { sendInvalidTokenError } from '../lib/errors';
import logger from '../lib/logger';
import { isProduction, jwtSecret, redis, sessionSecret } from '../config';
import User from '../models/User';
import { ExtendedRequest } from '../custom';

// TODO: add valid tokens to redis storage

// TODO: Revoke tokens which are not present in the redis storage

// TODO: Remove token from redis storage if user, user-role,
// user-role-permission, or user-role-permission-dependencies change

// TODO: Remove express-session and store the entire user in JWT tokens
const parseJwt = jwt({
  credentialsRequired: false,
  secret: jwtSecret,
  requestProperty: '__user'
});

const RedisStore = redisStore(session);
// Use sessions as a helper so we won't need to refetch user on every request.
// We identify the user with JWT token, and keep the user in session for a
// single client session. This means we make a database request every time
// when user's client don't support cookies. This need to go away.
const addSession = session({
  store: new RedisStore({ host: redis.host }),
  secret: sessionSecret,
  cookie: { secure: isProduction },
  name: 'PHPSESSID',
  proxy: true,
  resave: false,
  saveUninitialized: false
});

const getUserForRequest = async (req: ExtendedRequest): Promise<User | null> => {
  if (!req.__user || !req.__user.id) {
    logger.debug('No access token in header');
    return null;
  }

  if (req.session && req.session.user) {
    try {
      logger.debug('Reading user from session');

      return User.fromJson(req.session.user);
    } catch (err) {
      logger.debug('Error while converting session user. ', err);

      req.session.destroy();
      req.user = null;

      throw err;
    }
  }

  logger.debug('Could not find user on session.');

  return await User.query()
    .eager('[roles, roles.permissions]')
    .findById(req.__user.id)
    .select('email', 'id')
    .then((user) => {
      logger.debug('Fetched user from database');
      req.session.user = user;

      logger.debug('Setting user on session');
      req.session.save();

      return user;
    });
};

// Put the user to request from serialized user on session if there isn't
// already a user.
const addUserToRequest = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  getUserForRequest(req)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      logger.debug(err);
      next();
    });
};

// If jwt token is expired, simply forward the request. Graphql handlers will
// check for user and fail themselves. No need to heckle here for crucial routes
// like login
const forwardExpiredTokenRequests = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return next();
  }

  return next(err);
};

export default [parseJwt, addSession, addUserToRequest, forwardExpiredTokenRequests];
