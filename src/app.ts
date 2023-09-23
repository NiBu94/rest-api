import config from './configs/config';
import app from './server';
import { logger } from './configs/loggers';

app.listen(config.port, () => {
  logger.info(`running on http://localhost:${config.port}`);
  logger.info(`environment: ${config.env}`);
});
