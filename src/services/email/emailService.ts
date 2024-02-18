//@ts-nocheck
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';
import config from '../../configs/config';
import logger from '../../configs/logger';
import { formatWeeks, getWeekName } from '../../modules/formatWeeks';
import { formatDate } from '../../modules/formatDate';

const { host, port, user, pass } = config.smtp;

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: true,
  auth: {
    user,
    pass,
  },
});

transporter.use(
  'compile',
  hbs({
    viewEngine: {
      extName: '.hbs',
      partialsDir: path.join(__dirname, 'templates'),
      layoutsDir: path.join(__dirname, 'templates'),
      defaultLayout: '',
    },
    viewPath: path.join(__dirname, 'templates'),
    extName: '.hbs',
  })
);

const sendPaymentSuccessToCustomer = async (customer, children, weeks, price) => {
  logger.debug(
    `Sending email to customer with following data: ${JSON.stringify(customer)}\n${JSON.stringify(children)}\n${JSON.stringify(weeks)}\n${price}`
  );
  const firstChild = {};
  const secondChild = {};

  for (const child of children) {
    for (const [key, value] of Object.entries(child)) {
      child.firstChild ? (firstChild[key] = value) : (secondChild[key] = value);
    }
  }

  if (secondChild.firstName) {
    secondChild.fullName = ` und ${secondChild.firstName} ${secondChild.lastName}`;
  }

  const info = await transporter.sendMail({
    from: user,
    to: customer.email,
    subject: 'Van der Merwe Center - Anmeldung Kindercamp',
    template: 'successEmailCustomer',
    context: {
      customer,
      firstChild,
      secondChild,
      weeks: formatWeeks(weeks),
      price,
    },
  });
  logger.debug(`Email sent: ${JSON.stringify(info)}`);
};

const sendPaymentSuccessToOwner = async (customer, children, weeks, price) => {
  logger.debug(
    `Sending email to owner with following data: ${JSON.stringify(customer)}\n${JSON.stringify(children)}\n${JSON.stringify(weeks)}\n${price}`
  );
  const firstChild = {};
  const secondChild = {};

  for (const child of children) {
    for (const [key, value] of Object.entries(child)) {
      child.firstChild ? (firstChild[key] = value) : (secondChild[key] = value);
    }
  }

  firstChild.allowanceToGoHomeAlone = firstChild.allowanceToGoHomeAlone ? 'Ja' : 'Nein';
  firstChild.allergies = firstChild.allergies ? firstChild.allergies.replace(/\n/g, '<br>') : 'Keine';
  firstChild.birthday = formatDate(firstChild.birthday);
  if (secondChild.firstName) {
    secondChild.allowanceToGoHomeAlone = secondChild.allowanceToGoHomeAlone ? 'Ja' : 'Nein';
    secondChild.allergies = secondChild.allergies ? secondChild.allergies.replace(/\n/g, '<br>') : 'Keine';
    secondChild.birthday = formatDate(secondChild.birthday);
  }
  customer.secondPhoneNumber = customer.secondPhoneNumber ? customer.secondPhoneNumber : 'Keine';
  customer.optionalMessage = customer.optionalMessage ? customer.optionalMessage.replace(/\n/g, '<br>') : 'Keine';

  const weekObj = {};

  for (const week of weeks) {
    weekObj[getWeekName(week.name)] = week.days.map((day) => day.name).join(', ');
  }

  const info = await transporter.sendMail({
    from: user,
    to: config.saferpay.receiverForNotification,
    subject: `Van der Merwe Center - Anmeldung Kindercamp (${customer.firstName} ${customer.lastName})`,
    template: 'successEmailOwner',
    context: {
      customer,
      firstChild,
      secondChild,
      week: weekObj,
      price,
    },
  });
  logger.debug(`Email sent: ${JSON.stringify(info)}`);
};

export default {
  sendPaymentSuccessToCustomer,
  sendPaymentSuccessToOwner,
};
