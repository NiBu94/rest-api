export const customerEmail = async (
  firstNameCustomer,
  lastNameCustomer,
  firstNameChild,
  lastNameChild
) => {
  let successHTML = `<p>Guten Tag ${firstNameCustomer} ${lastNameCustomer} </p>`;
  successHTML += `<p>Wir bedanken uns für Ihr Interesse an den Multisport-Camps im Van der Merwe Center und bestätigen Ihnen die Anmeldung für ${firstNameChild} ${lastNameChild} für das folgende Camp:
    </p>`;
    successHTML +=  
  `Betreff: Van der Merwe Center - Anmeldung Kindercamp

Guten Tag (Vorname Kontaktperson) (Nachname Kontaktperson) 


(Campwoche) für (Wochentage)
Das Camp kostet CHF XXX

Allgemeine Informationen für Camp-Teilnehmer:
Treffpunkt ist täglich um 10:00 Uhr im Eingangsbereich des Van der Merwe Centers. 
Die Camp-Teilnehmer sollten Sportkleidung und Sportschuhe anziehen und eine Trinkflasche mitnehmen. An kühlen Tagen empfehlen wir zusätzlich zur Sportkleidung auch einen Pullover/Trainingsjacke mitzubringen. Im Sommer sollten die Kinder einen Hut mitbringen und sich zu Hause eincremen.

Wir freuen uns auf das Camp!
Ihr Multisport-Camp Team`;
};

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const mailOptions = {
  from: 'test@vandermerwe.ch',
  to: 'bulokhov.nikita@gmail.com',
  subject: 'Test',
  html: 'Test Text',
};

transporter.sendMail(mailOptions, (err, info) => {});
