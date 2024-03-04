//@ts-nocheck
import express from 'express';
import cors from 'cors';
import logger from './configs/logger';
import paymentRouter from './routes/payment';
import config from './configs/config';
import morgan from './middleware/morgan';
import { v4 as uuidv4 } from 'uuid';
import basicAuth from './middleware/auth';

const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || origin === 'http://localhost') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.id = uuidv4();
  next();
});
app.use(morgan);
app.get(`/${config.api}/health-check`, (req, res) => {
  res.status(200).end();
});

app.use(`/${config.api}/payment`, paymentRouter);
if (config.env !== 'local') {
  app.get('/admin/toggle-debug-logging', basicAuth, logger.toggleDebugLogging);
}

export default app;
