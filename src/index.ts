import config from './configs/config';
import app from './app';
import logger from './configs/logger';
// import crypto from 'crypto';

// logger.info(`${crypto.randomBytes(32).toString('hex')}`);

app.listen(config.port, () => {
  logger.info(`running on http://localhost:${config.port}`);
  logger.info(`environment: ${config.env}`);
});
