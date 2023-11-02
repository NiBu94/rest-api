//@ts-nocheck
import nodemailer from 'nodemailer';
import config from '../configs/config';
import { getDataForEmails } from '../db';
import { logger } from '../configs/loggers';

const { host, port, user, pass } = config.secrets.smtp;

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: true,
  auth: {
    user,
    pass,
  },
});

function sendEmail(mailOptions) {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
}

export const sendEmails = async (customToken) => {
  try {
    const data = await getDataForEmails(customToken);
    const { customer } = data.payment.booking;
    const { children } = customer;
    const firstChild = {};
    const secondChild = {};
    for (const child of children) {
      if (child.firstChild) {
        firstChild.firstName = child.firstName;
        firstChild.lastName = child.lastName;
        firstChild.birthday = child.birthday;
        firstChild.gender = child.gender;
        firstChild.allowanceToGoHomeAlone = child.allowanceToGoHomeAlone;
        firstChild.allergies = child.allergies;
      } else {
        secondChild.firstName = child.firstName;
        secondChild.lastName = child.lastName;
        secondChild.birthday = child.birthday;
        secondChild.gender = child.gender;
        secondChild.allowanceToGoHomeAlone = child.allowanceToGoHomeAlone;
        secondChild.allergies = child.allergies;
      }
    }
    let customerContent = `<p>Guten Tag ${customer.firstName} ${customer.lastName} </p>`;
    customerContent += `<p>Wir bedanken uns für Ihr Interesse an den Multisport-Camps im Van der Merwe Center und bestätigen Ihnen die Anmeldung für ${firstChild.firstName} ${firstChild.lastName} für das folgende Camp:</p>`;
    const weekMap = {
      carnivalFirstWeek: '1. Woche Karneval',
      carnivalSecondWeek: '2. Woche Karneval',
      easterFirstWeek: '1. Woche Osterferien',
      easterSecondWeek: '2. Woche Osterferien',
      summerFirstWeek: '1. Woche Sommerferien',
      summerSecondWeek: '2. Woche Sommerferien',
      summerThirdWeek: '3. Woche Sommerferien',
      summerFourthWeek: '4. Woche Sommerferien',
      summerFifthWeek: '5. Woche Sommerferien',
      summerSixthWeek: '6. Woche Sommerferien',
      autumnFirstWeek: '1. Woche Herbstferien',
      autumnSecondWeek: '2. Woche Herbstferien',
      christmasFirstWeek: '1. Woche Weihnachtsferien',
      christmasSecondWeek: '2. Woche Weihnachtsferien',
    };
    const { bookedWeeks } = data.payment.booking;
    const price = data.payment.amount;
    for (const week of bookedWeeks) {
      const daysString = week.bookedDays.map((dayObj) => dayObj.bookedDay).join(', ');
      customerContent += `${weekMap[week.weekName]} für ${daysString}<br>`;
    }
    customerContent += `<p>Das Camp kostet CHF ${price}</p>`;
    customerContent += '<p><strong>Allgemeine Informationen für Camp-Teilnehmer:</strong></p>';
    customerContent += 'Treffpunkt ist täglich um 10:00 Uhr im Eingangsbereich des Van der Merwe Centers.<br>';
    customerContent +=
      '<p>Die Camp-Teilnehmer sollten Sportkleidung und Sportschuhe anziehen und eine Trinkflasche mitnehmen. An kühlen Tagen empfehlen wir zusätzlich zur Sportkleidung auch einen Pullover/Trainingsjacke mitzubringen. Im Sommer sollten die Kinder einen Hut mitbringen und sich zu Hause eincremen.</p>';
    customerContent += 'Wir freuen uns auf das Camp!<br>';
    customerContent += 'Ihr Multisport-Camp Team';

    const mailOptionsCustomer = {
      from: user,
      to: customer.email,
      subject: 'Betreff: Van der Merwe Center - Anmeldung Kindercamp',
      html: customerContent,
    };

    const responseCustomer = await sendEmail(mailOptionsCustomer);
    logger.info('E-Mail sent to customer:', responseCustomer);

    let ownerContent = `<table style="width: 100%; border-collapse: collapse;" border="0">
    <tbody>
    <tr>
    <td style="width: 40%;"><strong>Kind</strong></td>
    <td style="width: 60%;"></td>
    </tr>
    <tr>
    <td style="width: 40%;">Vorname</td>
    <td style="width: 60%;">${firstChild.firstName}</td>
    </tr>
    <tr>
    <td style="width: 40%;">Nachname</td>
    <td style="width: 60%;">${firstChild.lastName}</td>
    </tr>
    <tr>
    <td style="width: 40%;">Geburtstag</td>
    <td style="width: 60%;">${firstChild.birthday}</td>
    </tr>
    <tr>
    <td style="width: 40%;">Geschlecht</td>
    <td style="width: 60%;">${firstChild.gender}</td>
    </tr>
    <tr>
    <td style="width: 40%;">Alleine nach Hause</td>
    <td style="width: 60%;">${firstChild.allowanceToGoHomeAlone ? 'Ja' : 'Nein'}</td>
    </tr>
    <tr>
    <td style="width: 40%;">Allergien</td>
    <td style="width: 60%;">${firstChild.allergies ? firstChild.allergies.replace(/\n/g, '<br>') : 'Keine'}</td>
    </tr>
    <tr>
    <td style="width: 40%;">&nbsp</td>
    <td style="width: 60%;">&nbsp</td>
    </tr>`;
    if (secondChild.firstName) {
      ownerContent += `
      <tr>
      <td style="width: 40%;"><strong>Geschwisterkind</strong></td>
      <td style="width: 60%;"></td>
      </tr>
      <tr>
      <td style="width: 40%;">Vorname</td>
      <td style="width: 60%;">${secondChild.firstName}</td>
      </tr>
      <tr>
      <td style="width: 40%;">Nachname</td>
      <td style="width: 60%;">${secondChild.lastName}</td>
      </tr>
      <tr>
      <td style="width: 40%;">Geburtstag</td>
      <td style="width: 60%;">${secondChild.birthday}</td>
      </tr>
      <tr>
      <td style="width: 40%;">Geschlecht</td>
      <td style="width: 60%;">${secondChild.gender}</td>
      </tr>
      <tr>
      <td style="width: 40%;">Alleine nach Hause</td>
      <td style="width: 60%;">${secondChild.allowanceToGoHomeAlone ? 'Ja' : 'Nein'}</td>
      </tr>
      <tr>
      <td style="width: 40%;">Allergien</td>
      <td style="width: 60%;">${secondChild.allergies ? secondChild.allergies.replace(/\n/g, '<br>') : 'Keine'}</td>
      </tr>
      <tr>
      <td style="width: 40%;">&nbsp</td>
      <td style="width: 60%;">&nbsp</td>
      </tr>
      `;
    }
    ownerContent += `
    <tr>
    <td style="width: 40%;"><strong>Kontaktperson</strong></td>
    <td style="width: 60%;"></td>
    </tr>
    <tr>
    <td style="width: 40%;">Vorname</td>
    <td style="width: 60%;">${customer.firstName}</td>
    </tr>
    <tr>
    <td style="width: 40%;">Nachname</td>
    <td style="width: 60%;">${customer.lastName}</td>
    </tr>
    <tr>
    <td style="width: 40%;">Geburtstag</td>
    <td style="width: 60%;">${customer.street}</td>
    </tr>
    <tr>
    <td style="width: 40%;">Geschlecht</td>
    <td style="width: 60%;">${customer.streetNumber}</td>
    </tr>
    <tr>
    <td style="width: 40%;">Alleine nach Hause</td>
    <td style="width: 60%;">${customer.zipCode}</td>
    </tr>
    <tr>
    <td style="width: 40%;">Ort</td>
    <td style="width: 60%;">${customer.city}</td>
    </tr>
    <tr>
    <td style="width: 40%;">Email</td>
    <td style="width: 60%;">${customer.email}</td>
    </tr>
    <tr>
    <td style="width: 40%;">Telefon_1</td>
    <td style="width: 60%;">${customer.firstPhoneNumber}</td>
    </tr>
    <tr>
    <td style="width: 40%;">Telefon_2</td>
    <td style="width: 60%;">${customer.secondPhoneNumber ? customer.secondPhoneNumber : 'Keine'}</td>
    </tr>
    <tr>
    <td style="width: 40%;">&nbsp</td>
    <td style="width: 60%;">&nbsp</td>
    </tr>
    <tr>
    <td style="width: 40%;"><strong>Campdetails</strong></td>
    <td style="width: 60%;"></td>
    </tr>
    `;

    for (const week of bookedWeeks) {
      const daysString = week.bookedDays.map((dayObj) => dayObj.bookedDay).join(', ');
      ownerContent += `
      <tr>
      <td style="width: 40%;">Woche</td>
      <td style="width: 60%;">${weekMap[week.weekName]}</td>
      </tr>
      <tr>
      <td style="width: 40%;">Tage</td>
      <td style="width: 60%;">${daysString}</td>
      </tr>`;
    }
    ownerContent += `
    <tr>
    <td style="width: 40%;">Preis</td>
    <td style="width: 60%;">${price}</td>
    </tr>
    <tr>
    <td style="width: 40%;">Bezahlt</td>
    <td style="width: 60%;">Ja</td>
    </tr>
    <tr>
    <td style="width: 40%;">Nachricht</td>
    <td style="width: 60%;">${customer.optionalMessage ? customer.optionalMessage.replace(/\n/g, '<br>') : 'Keine'}</td>
    </tr>
    <tr>
    <td style="width: 40%;">AGB Akzeptiert</td>
    <td style="width: 60%;">Ja</td>
    </tr>
    </tbody>
    `;

    const mailOptionsOwner = {
      from: user,
      to: 'contact@nbweb.solutions',
      subject: `Betreff: Van der Merwe Center - Anmeldung Kindercamp (${customer.firstName} ${customer.lastName})`,
      html: ownerContent,
    };

    const responseOwner = await sendEmail(mailOptionsOwner);
    logger.info('E-Mail sent to owner:', responseOwner);

    // For some reason, winston logger cant log response?
    // logger.info('Email sent to customer:', response.accepted);
  } catch (err) {
    logger.error('Error sending email:', err);
  }
};
