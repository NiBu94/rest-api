//@ts-nocheck
import { Request, Response, NextFunction } from 'express';
import config from '../configs/config';
import logger from '../configs/logger';

export const basicAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send('Access Denied. No credentials sent!');
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  if (username === config.admin.user && password === config.admin.pass) {
    next();
  } else {
    logger.warn(`Unauthorized access. username: ${username}`);
    return res.status(401).send('Access Denied. Incorrect credentials!');
  }
};

export const authenticated = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    logger.warn('Unauthorized access');
    res.status(401).send('Bitte loggen Sie sich ein.');
  }
  next();
};

export const redirectIfAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.userId) {
    res.redirect('/dashboard');
  } else {
    next();
  }
};
