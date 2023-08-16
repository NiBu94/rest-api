import express from 'express';
import cors from 'cors';
import { winstonLogger, morganLogger } from './configs/loggers';
import paymentKidsCampt from './routes/payment-kids-camp';
import emailRouter from './routes/email';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morganLogger);

app.use('/api', paymentKidsCampt, emailRouter);

app.use((err, req, res, next) => {
  winstonLogger.error(err.message);
  res.status(500).json({ message: 'Something broke!' });
});

export default app;
