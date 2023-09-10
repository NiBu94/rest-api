import express from 'express';
import cors from 'cors';
import { winstonLogger, morganLogger } from './configs/loggers';
import paymentKidsCamp from './routes/initialize-payment';
import paymentStatus from './routes/payment-status';
import paymentNotificationSuccess from './routes/payment-notification-success';
import paymentNotificationFailure from './routes/payment-notification-failure';

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