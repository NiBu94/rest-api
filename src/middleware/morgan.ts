import morgan from 'morgan';
import logger from '../configs/logger';
import config from '../configs/config';

morgan.token('id', (req) => req.id);
function getStatusColor(status) {
  if (status >= 500) return '\x1b[31m';
  if (status >= 400) return '\x1b[33m';
  if (status >= 300) return '\x1b[36m';
  if (status >= 200) return '\x1b[32m';
  return '\x1b[0m';
}

let morganConfig;
if (config.env === 'local') {
  morganConfig = morgan(
    (tokens, req, res) => {
      const status = tokens.status(req, res);
      const color = getStatusColor(status);
      return [
        '[IN]',
        tokens.method(req, res),
        tokens.url(req, res),
        color + status + '\x1b[0m',
        tokens['response-time'](req, res),
        'ms',
        '-',
        tokens.res(req, res, 'content-length'),
        '\n---------------------------------------------------------------------------',
      ].join(' ');
    },
    { stream: { write: (message) => logger.http(message) } }
  );
} else {
  morganConfig = morgan('[IN] - [:id] - :method :url :status :response-time ms  - :res[content-length]', {
    stream: { write: (message) => logger.http(message) },
  });
}

export default morganConfig;
