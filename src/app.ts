//@ts-nocheck
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import logger from './configs/logger';
import paymentRouter from './routes/payment';
import userRouter from './routes/user';
import dashboardRouter from './routes/dashboard';
import weekDataRouter from './routes/weekData';
import config from './configs/config';
import morgan from './middleware/morgan';
import { v4 as uuidv4 } from 'uuid';
import { basicAuth } from './middleware/auth';

const app = express();

//express security documentation?

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.id = uuidv4();
  next();
});
app.use(morgan);
app.use(session(config.session));
app.set('trust proxy', 1);

app.get(`/${config.api}/health-check`, basicAuth, (req, res) => {
  res.status(200).end();
});

app.use(`/${config.api}/payment`, paymentRouter);
app.use(`/${config.api}/user`, basicAuth, userRouter);
app.use(`/${config.api}/week-data`, weekDataRouter);
app.use(`/admin`, dashboardRouter);

if (config.env !== 'local') {
  app.get(`/${config.api}/admin/toggle-debug-logging`, basicAuth, logger.toggleDebugLogging);
}

export default app;
