import config from '../configs/config';

const basicAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.sendStatus(401).send('Access Denied. No credentials sent!');
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  if (username === config.debug.user && password === config.debug.pass) {
    next();
  } else {
    return res.sendStatus(401).send('Access Denied. Incorrect credentials!');
  }
};

export default basicAuth;
