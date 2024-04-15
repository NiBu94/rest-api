//@ts-nocheck
import db from '../services/db/dbService';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import config from '../configs/config';
import logger from '../configs/logger';

export const basicAuth = async (req: Request, res: Response, next) => {
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
    logger.warn(`Login failed. Username: ${req.body.username}`);
    return res.status(401).send('Access Denied. Incorrect credentials!');
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const user = await db.user.get(req.body.username);
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      req.session.username = user.name;
      return res.redirect('/dashboard');
    } else {
      logger.warn(`Login failed. Username: ${req.body.username}`);
      return res.status(401).send('Login failed');
    }
  } catch (err) {
    logger.error(err);
    return res.status(401).send('Login failed');
  }
};
