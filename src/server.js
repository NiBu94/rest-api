import express from 'express';
import cors from 'cors';
import { winstonLogger, morganLogger } from './configs/loggers.js';
import paymentKidsCamp from './routes/payment-kids-camp.js';
import paymentStatus from './routes/status-payment-kids-camp.js';
import paymentNotificationSuccess from './routes/payment-notification-success.js';
import paymentNotificationFailure from './routes/payment-notification-failure.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morganLogger);




app.use('/api', paymentKidsCamp, paymentStatus, paymentNotificationSuccess, paymentNotificationFailure);

app.use((err, req, res, next) => {
  winstonLogger.error(err.message);
  res.status(500).json({ message: err.message });
});
export default app;