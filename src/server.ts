import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/', (req, res) => {
  //res.json({ message: req.body });
  console.log(req.body);
});

export default app;
