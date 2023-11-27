import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { logger, morganFile } from './configs/loggers';
import router from './routes/payment-router';
import config from './configs/config';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (config.env === 'local') {
  app.use(morgan('dev'));
} else {
  app.use(morganFile);
}

app.use(`/${config.api}/payment`, router);

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: err.message });
});
export default app;
