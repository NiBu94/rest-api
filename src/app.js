import config from './configs/config.js';
import app from './server.js';
import { winstonLogger } from './configs/loggers.js';
app.listen(config.port, () => {
  winstonLogger.info(`running on http://localhost:${config.port}`);
  winstonLogger.info(`environment: ${config.env}`);
});
