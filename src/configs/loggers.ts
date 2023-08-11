import winston from 'winston';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import config from './config';

const logDir = path.join(__dirname, '..', '..', 'logs');

if (config.env === 'production' && !fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

let transports = [];

if (config.env === 'development') {
  transports.push(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
} else {
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
    })
  );
}

export const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: transports,
});

// Morgan
morgan.token('body', function (req, res) {
  return JSON.stringify(req.body);
});

const logFormat =
  ':method :url :status :response-time ms - :res[content-length] - Body:\n :body';

let morganStream;

if (config.env === 'development') {
  morganStream = process.stdout;
} else {
  morganStream = fs.createWriteStream(path.join(logDir, 'request.log'), {
    flags: 'a',
  });
}

export const morganLogger = morgan(logFormat, {
  stream: morganStream,
});
