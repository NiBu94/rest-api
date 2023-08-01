import { Router } from 'express';
import nodemailer from 'nodemailer';

const emailRouter = Router();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  

  emailRouter.post('/send-email', (req, res) => {

  const mailOptions = {
    from: 'info@vandermerve.ch',
    to: 'bulokhov.nikita@gmail.com',
    subject: 'Test',
    text: 'Test Text'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(400).send(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Email sent successfully!');
    }
  });
});

export default emailRouter;
