//@ts-nocheck
import { Request, Response } from 'express';
import path from 'path';
import db from '../services/db/dbService';
import excel from '../services/excelService';
import logger from '../configs/logger';

const loginHtml = (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'login.html'));
};

const styles = (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'styles.css'));
};

const loginJs = (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'login.js'));
};

const dashboardHtml = (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'dashboard.html'));
};

export const login = async (req: Request, res: Response) => {
  try {
    const user = await db.user.get(req.body.email);
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      req.session.userId = user.id;
      return res.status(200).json({ redirectURL: '/dashboard' });
    } else {
      logger.warn(`Login failed. Username: ${req.body.email}`);
      return res.status(401).send('Login failed');
    }
  } catch (err) {
    logger.error(err);
    return res.status(401).send('Login failed');
  }
};

const downloadExcel = async (req: Request, res: Response) => {
  try {
    const weeks = await db.week.getMany(req.body.weeks);
    // const weekDays = excel.getWeekDays();
    // const workbook = excel.createWorkbook();
    // for (const reqWeek of req.body.weeks) {
    //   const headers = excel.createHeaders(weekDays[reqWeek]);
    //   const headerConfig = excel.createHeaderConfig(headers);
    //   const data = [];
    //   for (const week of weeks) {
    //     data.push({
    //       Nachname: week.booking.customer.children[0].lastName
    //       Vorname:
    //     });
    //   }
    //   const worksheet = excel.createWorksheet(workbook, reqWeek, headers, headerConfig);
    //   workbook.addWorksheet(worksheet);
    // }

    res.status(200).json(weeks);
  } catch (err) {
    logger.error(err);
    return res.sendStatus(500);
  }
};

export default {
  loginHtml,
  styles,
  loginJs,
  dashboardHtml,
  login,
  downloadExcel,
};
