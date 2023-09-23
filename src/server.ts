import express from 'express';
import cors from 'cors';
import { logger, morgan } from './configs/loggers';
import router from './routes/payment-router';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan);

app.use('/api/payment', router);

app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(500).json({ message: err.message });
});
export default app;
