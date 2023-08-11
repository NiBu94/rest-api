import express from 'express';
import { winstonLogger, morganLogger } from './configs/loggers';
import kidsCamp from './routes/payment-kids-camp';
import emailRouter from './routes/email';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morganLogger);

app.get('/', (req, res, next) => {
  res.status(200);
});

app.use((err, req, res, next) => {
  winstonLogger.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

app.use('/api', kidsCamp, emailRouter);

export default app;
