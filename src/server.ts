import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { logger, morganFile } from './configs/loggers';
import router from './routes/payment-router';
import config from './configs/config';
import { createNewUser, signIn } from './user';
import basicAuth from './middleware/basic-auth';
import path from 'path';
import { protect } from './auth';

const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || origin === 'http://localhost') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (config.env === 'local') {
  app.use(morgan('dev'));
} else {
  app.use(morganFile);
}

app.use(`/${config.api}/payment`, router);

app.post('/api/user', basicAuth, createNewUser);
app.post('/api/sign-in', signIn);
app.get('/form', /*protect,*/ (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login', 'login.html'));
});


app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: err.message });
});
export default app;
