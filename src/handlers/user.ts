import db from '../services/db/dbService';
import logger from '../configs/logger';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

const get = async (req: Request, res: Response) => {
  try {
    const user = await db.user.get(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    logger.error(err);
    res.sendStatus(500);
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const users = await db.user.getAll();
    res.status(200).json(users);
  } catch (err) {
    logger.error(err);
    res.sendStatus(500);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    await db.user.create(req.body.username, hash);
    res.sendStatus(201);
  } catch (err) {
    logger.error(err);
    res.sendStatus(500);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    await db.user.update(req.body.email, hash);
    res.sendStatus(204);
  } catch (err) {
    logger.error(err);
    res.sendStatus(500);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    await db.user.deleteUser(req.params.id);
    res.sendStatus(200).end();
  } catch (err) {
    logger.error(err);
    res.sendStatus(500);
  }
};

export default {
  get,
  getAll,
  create,
  update,
  deleteUser,
};
