import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import config from '../configs/config';
import { createGermanDateTime } from '../modules/formatDate';

morgan.token('date', () => createGermanDateTime());
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
  morganConfig = morgan((tokens, req, res) => {
    const status = tokens.status(req, res);
    const color = getStatusColor(status);
    return [
      '\x1b[36mHTTP:\x1b[0m',
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
  });
} else {
  morganConfig = morgan(':date HTTP: [IN] :remote-addr - [:id] - :method :url HTTP/:http-version :status :response-time ms  - :res[content-length]', {
    stream: fs.createWriteStream(path.join(__dirname, '..', '..', 'logs', 'server.log'), { flags: 'a' }),
  });
}

export default morganConfig;
