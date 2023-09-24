import { createLogger, format, transports } from 'winston';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import config from './config';

const { combine, timestamp, printf, colorize } = format;

const logDir = path.join(__dirname, '..', '..', 'logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

export const logger = createLogger({
  level: 'info',
  format: combine(timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }), customFormat),
  transports: [
    new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new transports.File({ filename: path.join(logDir, 'combined.log') }),
  ],
});

if (config.env === 'local') {
  logger.add(
    new transports.Console({
      format: combine(timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }), customFormat, colorize()),
    })
  );
}

// Morgan
/*
morganLogger.token('body', function (req, res) {
  return JSON.stringify(req.body);
});

const logFormat = ':method :url :status :response-time ms - :res[content-length] - Body:\n :body';
*/
let morganStream;

if (config.env === 'local') {
  morganStream = process.stdout;
} else {
  morganStream = fs.createWriteStream(path.join(logDir, 'request.log'), {
    flags: 'a',
  });
}

export const morganFile = morgan(config.env === 'local' ? 'dev' : 'common', {
  stream: morganStream,
});
