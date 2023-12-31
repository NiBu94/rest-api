//@ts-nocheck
import nodemailer from 'nodemailer';
import config from '../configs/config';
import db from '../db';

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
  const padZero = (number) => (number < 10 ? '0' + number : number);
  const formatDate = (date) => {
    const d = new Date(date);
    const day = padZero(d.getDate());
    const month = padZero(d.getMonth() + 1);
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const data = await db.email.getData(customToken);
  const { customer } = data.payment.booking;
  const { children } = customer;
  const firstChild = {};
  const secondChild = {};
  for (const child of children) {
    if (child.firstChild) {
      firstChild.firstName = child.firstName;
      firstChild.lastName = child.lastName;
      firstChild.birthday = formatDate(child.birthday);
      firstChild.gender = child.gender;
      firstChild.allowanceToGoHomeAlone = child.allowanceToGoHomeAlone;
      firstChild.allergies = child.allergies;
    } else {
      secondChild.firstName = child.firstName;
      secondChild.lastName = child.lastName;
      secondChild.birthday = formatDate(child.birthday);
      secondChild.gender = child.gender;
      secondChild.allowanceToGoHomeAlone = child.allowanceToGoHomeAlone;
      secondChild.allergies = child.allergies;
    }
  }
  let customerContent = `<p>Guten Tag ${customer.firstName} ${customer.lastName} </p>`;
  customerContent += `<p>Wir bedanken uns für Ihr Interesse an den Multisport-Camps im Van der Merwe Center und bestätigen Ihnen die Anmeldung für ${firstChild.firstName} ${firstChild.lastName} ${secondChild.firstName ? `und ${secondChild.firstName} ${secondChild.lastName} ` : ''}für das folgende Camp:</p>`;
  const weekMap = {
    carnivalFirstWeek: '1. Woche Fasnacht',
    carnivalSecondWeek: '2. Woche Fasnacht',
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
  const { weeks } = data.payment.booking;
  const { price } = data.payment;
  for (const week of weeks) {
    const daysString = week.days.map((day) => day.name).join(', ');
    customerContent += `${weekMap[week.name]} für ${daysString}<br>`;
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

  let ownerContent = `<table style="width: 100%; border-collapse: collapse;" border="0">
    <tbody>
    <tr>
    <td style="width: 20%;"><strong>Kind</strong></td>
    <td style="width: 80%;"></td>
    </tr>
    <tr>
    <td style="width: 20%;">Vorname</td>
    <td style="width: 80%;">${firstChild.firstName}</td>
    </tr>
    <tr>
    <td style="width: 20%;">Nachname</td>
    <td style="width: 80%;">${firstChild.lastName}</td>
    </tr>
    <tr>
    <td style="width: 20%;">Geburtstag</td>
    <td style="width: 80%;">${firstChild.birthday}</td>
    </tr>
    <tr>
    <td style="width: 20%;">Geschlecht</td>
    <td style="width: 80%;">${firstChild.gender}</td>
    </tr>
    <tr>
    <td style="width: 20%;">Alleine nach Hause</td>
    <td style="width: 80%;">${firstChild.allowanceToGoHomeAlone ? 'Ja' : 'Nein'}</td>
    </tr>
    <tr>
    <td style="width: 20%;">Allergien</td>
    <td style="width: 80%;">${firstChild.allergies ? firstChild.allergies.replace(/\n/g, '<br>') : 'Keine'}</td>
    </tr>
    <tr>
    <td style="width: 20%;">&nbsp</td>
    <td style="width: 80%;">&nbsp</td>
    </tr>`;
  if (secondChild.firstName) {
    ownerContent += `
      <tr>
      <td style="width: 20%;"><strong>Geschwisterkind</strong></td>
      <td style="width: 80%;"></td>
      </tr>
      <tr>
      <td style="width: 20%;">Vorname</td>
      <td style="width: 80%;">${secondChild.firstName}</td>
      </tr>
      <tr>
      <td style="width: 20%;">Nachname</td>
      <td style="width: 80%;">${secondChild.lastName}</td>
      </tr>
      <tr>
      <td style="width: 20%;">Geburtstag</td>
      <td style="width: 80%;">${secondChild.birthday}</td>
      </tr>
      <tr>
      <td style="width: 20%;">Geschlecht</td>
      <td style="width: 80%;">${secondChild.gender}</td>
      </tr>
      <tr>
      <td style="width: 20%;">Alleine nach Hause</td>
      <td style="width: 80%;">${secondChild.allowanceToGoHomeAlone ? 'Ja' : 'Nein'}</td>
      </tr>
      <tr>
      <td style="width: 20%;">Allergien</td>
      <td style="width: 80%;">${secondChild.allergies ? secondChild.allergies.replace(/\n/g, '<br>') : 'Keine'}</td>
      </tr>
      <tr>
      <td style="width: 20%;">&nbsp</td>
      <td style="width: 80%;">&nbsp</td>
      </tr>
      `;
  }
  ownerContent += `
    <tr>
    <td style="width: 20%;"><strong>Kontaktperson</strong></td>
    <td style="width: 80%;"></td>
    </tr>
    <tr>
    <td style="width: 20%;">Vorname</td>
    <td style="width: 80%;">${customer.firstName}</td>
    </tr>
    <tr>
    <td style="width: 20%;">Nachname</td>
    <td style="width: 80%;">${customer.lastName}</td>
    </tr>
    <tr>
    <td style="width: 20%;">Straße</td>
    <td style="width: 80%;">${customer.street}</td>
    </tr>
    <tr>
    <td style="width: 20%;">Hausnummer</td>
    <td style="width: 80%;">${customer.streetNumber}</td>
    </tr>
    <tr>
    <td style="width: 20%;">Postleitzahl</td>
    <td style="width: 80%;">${customer.zipCode}</td>
    </tr>
    <tr>
    <td style="width: 20%;">Ort</td>
    <td style="width: 80%;">${customer.city}</td>
    </tr>
    <tr>
    <td style="width: 20%;">Email</td>
    <td style="width: 80%;">${customer.email}</td>
    </tr>
    <tr>
    <td style="width: 20%;">Telefon_1</td>
    <td style="width: 80%;">${customer.firstPhoneNumber}</td>
    </tr>
    <tr>
    <td style="width: 20%;">Telefon_2</td>
    <td style="width: 80%;">${customer.secondPhoneNumber ? customer.secondPhoneNumber : 'Keine'}</td>
    </tr>
    <tr>
    <td style="width: 20%;">&nbsp</td>
    <td style="width: 80%;">&nbsp</td>
    </tr>
    <tr>
    <td style="width: 20%;"><strong>Campdetails</strong></td>
    <td style="width: 80%;"></td>
    </tr>
    `;

  for (const week of weeks) {
    const daysString = week.days.map((day) => day.name).join(', ');
    ownerContent += `
      <tr>
      <td style="width: 20%;">Woche</td>
      <td style="width: 80%;">${weekMap[week.name]}</td>
      </tr>
      <tr>
      <td style="width: 20%;">Tage</td>
      <td style="width: 80%;">${daysString}</td>
      </tr>`;
  }
  ownerContent += `
    <tr>
    <td style="width: 20%;">Preis</td>
    <td style="width: 80%;">${price}</td>
    </tr>
    <tr>
    <td style="width: 20%;">Bezahlt</td>
    <td style="width: 80%;">Ja</td>
    </tr>
    <tr>
    <td style="width: 20%;">Nachricht</td>
    <td style="width: 80%;">${customer.optionalMessage ? customer.optionalMessage.replace(/\n/g, '<br>') : 'Keine'}</td>
    </tr>
    <tr>
    <td style="width: 20%;">AGB Akzeptiert</td>
    <td style="width: 80%;">Ja</td>
    </tr>
    </tbody>
    `;

  const mailOptionsOwner = {
    from: user,
    to: config.notification,
    subject: `Betreff: Van der Merwe Center - Anmeldung Kindercamp (${customer.firstName} ${customer.lastName})`,
    html: ownerContent,
  };

  await sendEmail(mailOptionsOwner);
};
