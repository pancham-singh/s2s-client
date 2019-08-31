import { GraphQLServer } from 'graphql-yoga';
import * as morgan from 'morgan';
import * as path from 'path';
import * as fs from 'fs';
import * as rfs from 'rotating-file-stream';
import * as cors from 'cors';
import * as serveStatic from 'serve-static';

import { isProduction } from './config';
import { shallBootstrap, bootstrap } from './bootstrap';
import schema from './schema';
import authentication from './middleware/authentication';
import User from './models/User';
import { Request } from 'express';
import logger from './lib/logger';
import { ExtendedRequest, GqlContext } from './custom';

import uploadImageRoute from './routes/upload-image';

if (shallBootstrap()) {
  bootstrap();
}

const logDir = path.resolve(__dirname, '../http-access-logs');
const port = parseInt(process.env.PORT, 10) || 3000;
const server = new GraphQLServer({
  schema,
  context: (ctxProps): GqlContext => {
    return {
      user: ctxProps.request.user
    };
  }
});

fs.existsSync(logDir) || fs.mkdirSync(logDir);

if (isProduction) {
  // create a rotating write stream
  const accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily
    path: logDir
  });

  server.express.use(morgan('combined', { stream: accessLogStream }));
} else {
  server.express.use(morgan('dev'));
  // allow cross origin requests from anywhere
  server.express.use(cors());
}

server.express.set('trust proxy', 1);
server.express.use(authentication);
server.express.use('/upload-image', uploadImageRoute);
server.express.use('/static/images', serveStatic(path.resolve(__dirname, '../uploads')));

server.start(
  {
    port,
    endpoint: '/',
    playground: !isProduction && '/',
    debug: !isProduction
  },
  () => {
    console.log('Started graphql server on ', port);
  }
);
