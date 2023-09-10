import winston from 'winston';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import config from './config';


const logDir = path.join(__dirname, '..', '..', 'logs');

if (config.env !== 'local' && !fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

let transports = [];

if (config.env === 'local') {
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

const formatDate = () => {
  const d = new Date();
  const pad = (num) => (num < 10 ? '0' + num : num);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(
    d.getUTCSeconds()
  )}`;
};

const customFormat = winston.format.printf(({ timestamp, level, message, ...metadata }) => {
  return `${formatDate()} [${level}]: ${message} ${Object.keys(metadata).length ? JSON.stringify(metadata) : ''}`;
});

export const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), customFormat),
  transports: transports,
});

// Morgan
morgan.token('body', function (req, res) {
  return JSON.stringify(req.body);
});

const logFormat = ':method :url :status :response-time ms - :res[content-length] - Body:\n :body';

let morganStream;

if (config.env === 'local') {
  morganStream = process.stdout;
} else {
  morganStream = fs.createWriteStream(path.join(logDir, 'request.log'), {
    flags: 'a',
  });
}

export const morganLogger = morgan(logFormat, {
  stream: morganStream,
});
