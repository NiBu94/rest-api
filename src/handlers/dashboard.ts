//@ts-nocheck
import { Request, Response } from 'express';
import path from 'path';
import db from '../services/db/dbService';
import excel from '../services/excelService';
import logger from '../configs/logger';
import bcrypt from 'bcrypt';

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
      return res.status(200).json({ redirectURL: '/admin/dashboard' });
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
    const weekdays = excel.getWeekdays();
    const workbook = excel.createWorkbook();
    for (const reqWeek of req.body.weeks) {
      const headers = excel.createHeaders(weekdays[reqWeek].days);
      const headerConfig = excel.createHeaderConfig(headers);
      const data = [];
      for (const week of weeks) {
        if (reqWeek !== week.name) {
          continue;
        }
        const { booking } = week;
        const { customer } = booking;
        const { children } = customer;
        const firstChild = children[0];
        const { payment } = week.booking;
        let secondChild;
        if (children.length === 2) {
          secondChild = children[1];
        }

        data.push(
          excel.createDataObject(
            firstChild.lastName,
            firstChild.firstName,
            firstChild.gender,
            firstChild.birthday,
            firstChild.allergies,
            firstChild.allowanceToGoHomeAlone,
            weekdays[reqWeek].days,
            week.days,
            customer.firstPhoneNumber,
            customer.secondPhoneNumber,
            customer.email,
            payment.price
          )
        );

        if (secondChild) {
          data.push(
            excel.createDataObject(
              secondChild.lastName,
              secondChild.firstName,
              secondChild.gender,
              secondChild.birthday,
              secondChild.allergies,
              secondChild.allowanceToGoHomeAlone,
              weekdays[reqWeek].days,
              week.days,
              customer.firstPhoneNumber,
              customer.secondPhoneNumber,
              customer.email,
              payment.price
            )
          );
        }
      }
      data.sort((a, b) => a.Nachname.localeCompare(b.Nachname));
      excel.createWorksheet(workbook, weekdays[reqWeek].label, headers, headerConfig, data);
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="Report.xlsx"');

    await workbook.xlsx.write(res);
    res.end();
    // res.status(200).json(weeks);
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
