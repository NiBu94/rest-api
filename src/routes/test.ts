import { Router } from 'express';

const testRoute = Router();

testRoute.post('/test-route', (req, res) => {
  console.log(req.body);
  res.json({ message: 'hello from the other world' });
});

export default testRoute;
