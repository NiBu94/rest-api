import config from './configs/config';
import app from './app';
import logger from './configs/logger';

app.listen(config.port, () => {
  logger.info(`running on http://localhost:${config.port}`);
  logger.info(`environment: ${config.env}`);
});