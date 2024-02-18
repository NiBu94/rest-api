import express from 'express';
import cors from 'cors';
import paymentRouter from './routes/payment';
import config from './configs/config';
import morgan from './middleware/morgan';
import { v4 as uuidv4 } from 'uuid';

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

app.use(`/${config.api}/payment`, paymentRouter);

export default app;
