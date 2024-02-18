import { createLogger, format, transports, addColors } from 'winston';
import path from 'path';
import fs from 'fs';
import config from './config';

const { combine, timestamp, printf, colorize, errors } = format;

addColors({
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'cyan',
  verbose: 'magenta',
  debug: 'blue',
  silly: 'grey'
})

const logger = createLogger();

if (config.env !== 'local') {
  const logDir = path.join(__dirname, '..', '..', 'logs');

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  logger.configure({
    level: 'debug',
    format: combine(
      errors({ stack: true }),
      timestamp({
        format: 'DD.MM.YYYY HH:mm:ss',
      }),
      printf((info) => {
        if (info.stack) {
          return `${info.timestamp} ${info.level.toUpperCase()}: ${info.stack}`;
        }
        return `${info.timestamp} ${info.level.toUpperCase()}: ${info.message}`;
      })
    ),
    transports: [
      new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
      new transports.File({ filename: path.join(logDir, 'server.log'), level: 'info' }),
      new transports.File({ filename: path.join(logDir, 'debug.log'), level: 'debug' }),
    ],
  });
} else {
  logger.configure({
    level: 'http',
    format: combine(
      errors({ stack: true }),
      colorize(),
      printf((info) => {
        const regex = /(?<=\x1b\[\d+m)(error|warn|info|http|verbose|debug|silly)/i;

        const uppercaseLogLevel = info.level.replace(regex, (lvl) => lvl.toUpperCase());

        if (info.stack) {
          return `${uppercaseLogLevel}: ${info.stack}`;
        }
        return `${uppercaseLogLevel}: ${info.message}`;
      })
    ),
    transports: [new transports.Console()],
  });
}

export default logger;
