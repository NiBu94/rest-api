import db from '../services/db/dbService';
import logger from '../configs/logger';
import { Request, Response } from 'express';

const get = async (req: Request, res: Response) => {
  try {
    const weekData = await db.weekData.get(+req.params.year);
    res.status(200).json(weekData);
  } catch (err) {
    logger.error(err);
    res.sendStatus(500);
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const weekData = await db.weekData.getAll();
    res.status(200).json(weekData);
  } catch (err) {
    logger.error(err);
    res.sendStatus(500);
  }
};

const getYears = async (req: Request, res: Response) => {
  try {
    const years = await db.weekData.getYears();
    res.status(200).json(years);
  } catch (err) {
    logger.error(err);
    res.sendStatus(500);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const weekData = await db.weekData.create(req.body);
    res.status(201).json(weekData);
  } catch (err) {
    logger.error(err);
    res.sendStatus(500);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const weekData = await db.weekData.update(req.body);
    res.status(204).json(weekData);
  } catch (err) {
    logger.error(err);
    res.sendStatus(500);
  }
};

const deleteWeekData = async (req: Request, res: Response) => {
  try {
    await db.weekData.deleteWeekData(req.params.year);
    res.sendStatus(200);
  } catch (err) {
    logger.error(err);
    res.sendStatus(500);
  }
};

export default {
  get,
  getAll,
  getYears,
  create,
  update,
  deleteWeekData,
};
