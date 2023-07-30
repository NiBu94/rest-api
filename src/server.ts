import express from 'express';
import morgan from 'morgan';
import kidsCamp from './routes/payment-kids-camp';
import testRoute from './routes/test';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', testRoute, kidsCamp);

export default app;
