import express from 'express';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import kidsCamp from './routes/payment-kids-camp';
import emailRouter from './routes/email';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const logDir = path.join(__dirname, '..', 'logs');

// Check if directory exists, if not create it
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Define a custom token named 'body'
morgan.token('body', function (req, res) {
  return JSON.stringify(req.body);
});

const logFormat = ':method :url :status :response-time ms - Body:\n :body';
app.use(
  morgan(logFormat, {
    stream: fs.createWriteStream(path.join(logDir, 'request.log'), {
      flags: 'a',
    }),
  })
);

app.use('/api', kidsCamp, emailRouter);

export default app;
