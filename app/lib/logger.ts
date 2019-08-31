import * as winston from 'winston/lib/winston';
import * as path from 'path';
import { isProduction } from '../config';

const logDir = path.resolve('logs');
const alignedWithColorsAndTime = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf((info: any) => {
    const { timestamp, level, message, ...args } = info;

    const ts = timestamp.slice(0, 19).replace('T', ' ');
    return `${ts} [${level}]: ${message} ${
      Object.keys(args).length ? JSON.stringify(args, null, 2) : ''
    }`;
  })
);

const transports = [
  new winston.transports.Console({
    level: process.env.LOG_LEVEL || 'silly',
    format: alignedWithColorsAndTime
  })
];

if (isProduction) {
  require('winston-daily-rotate-file');

  const fileRotationTransport = new winston.transports.DailyRotateFile({
    filename: path.join(logDir, '%DATE%.log'),
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: false,
    maxSize: '20m',
    maxFiles: '14d'
  });

  transports.push(fileRotationTransport);
}

const logger = winston.createLogger({
  transports,
  exitOnErrors: false
});

export default logger;
