//@ts-nocheck
import ExcelJS from 'exceljs';
import { formatDate } from '../modules/formatDate';

const getWeekdays = () => {
  return {
    carnivalFirstWeek: { days: ['Mo', 'Di', 'Mi', 'Do', 'Fr'], label: 'Fasnachtsferien 1.' },
    carnivalSecondWeek: { days: ['Mo', 'Di', 'Mi', 'Do', 'Fr'], label: 'Fasnachtsferien 2.' },
    easterFirstWeek: { days: ['Mo', 'Di', 'Mi', 'Do'], label: 'Ostern 1.' },
    easterSecondWeek: { days: ['Di', 'Mi', 'Do', 'Fr'], label: 'Ostern 2.' },
    summerFirstWeek: { days: ['Mo', 'Di', 'Mi', 'Do', 'Fr'], label: 'Sommer 1.' },
    summerSecondWeek: { days: ['Mo', 'Di', 'Mi', 'Do', 'Fr'], label: 'Sommer 2.' },
    summerThirdWeek: { days: ['Mo', 'Di', 'Mi', 'Do', 'Fr'], label: 'Sommer 3.' },
    summerFourthWeek: { days: ['Mo', 'Di', 'Mi', 'Do', 'Fr'], label: 'Sommer 4.' },
    summerFifthWeek: { days: ['Mo', 'Di', 'Mi', 'Do', 'Fr'], label: 'Sommer 5.' },
    summerSixtWeek: { days: ['Mo', 'Di', 'Mi', 'Do', 'Fr'], label: 'Sommer 6.' },
    autumnFirstWeek: { days: ['Mo', 'Di', 'Mi', 'Do', 'Fr'], label: 'Herbst 1.' },
    autumnSecondWeek: { days: ['Mo', 'Di', 'Mi', 'Do', 'Fr'], label: 'Herbst 2.' },
    christmasFirstWeek: { days: ['Mi', 'Do', 'Fr'], label: 'Weihnachten 1.' },
    christmasSecondWeek: { days: ['Di', 'Mi', 'Do', 'Fr'], label: 'Weihnachten 2.' },
  };
};
const defaultFont = {
  name: 'Calibri',
  size: 10,
  color: { argb: 'FF000000' },
};

const createHeaders = (weekdays) => {
  const arr = [];
  arr.push('Nachname', 'Vorname', 'm/w', 'Geburtstag', 'Allergien', 'Alleine nach Hause');

  for (const weekday of weekdays) {
    arr.push(weekday);
  }

  arr.push('Telefon 1', 'Telefon 2', 'Email', 'Zusatz-betreuung', 'Betrag bezahlt');
  return arr;
};

const createHeaderConfig = (headers) => {
  const headerConfig = headers.map((header) => {
    let width;
    if (['Mo', 'Di', 'Mi', 'Do', 'Fr'].includes(header)) {
      width = 5;
    } else if (header === 'm/w') {
      width = 6;
    } else if (header === 'Geburtstag') {
      width = 12;
    } else if (header === 'Alleine nach Hause') {
      width = 6.5;
    } else if (header === 'Zusatz-betreuung') {
      width = 9.5;
    } else if (header === 'Betrag bezahlt') {
      width = 6.5;
    } else if (header === 'Email') {
      width = 35;
    } else {
      width = 15;
    }

    return {
      header: header,
      key: header,
      width: width,
      style: {
        font: defaultFont,
        alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' },
      },
    };
  });
  return headerConfig;
};

const createWorkbook = () => new ExcelJS.Workbook();

const createDataObject = (lastName, firstName, gender, birthday, allergies, allowanceToGoHomeAlone, headers, weekdays, telephone1, telephone2, email, amountPaid) => {
  const obj = {
    Nachname: lastName,
    Vorname: firstName,
    'm/w': gender === 'Männlich' ? 'm' : 'w',
    Geburtstag: formatDate(birthday),
    Allergien: allergies ? allergies : 'keine',
    'Alleine nach Hause': allowanceToGoHomeAlone ? 'ja' : 'nein',
  };

  for (const header of headers) {
    obj[header] = '';
  }

  for (const week of weekdays) {
    obj[week.name] = 'X';
  }

  obj['Telefon 1'] = telephone1;
  obj['Telefon 2'] = telephone2;
  obj.Email = email;
  obj.Zusatzbetreuung = '';
  obj['Betrag bezahlt'] = amountPaid.toString();
  return obj;
};

const createWorksheet = (workbook, worksheetDescription, headers, headerConfig, data) => {
  const worksheet = workbook.addWorksheet(worksheetDescription);

  worksheet.columns = headerConfig;

  data.forEach((row) => {
    const newRow = worksheet.addRow(row);
    newRow.font = defaultFont;
  });

  // Apply borders to all cells
  worksheet.eachRow({ includeEmpty: true }, function (row) {
    row.eachCell({ includeEmpty: true }, function (cell) {
      cell.border = {
        top: { style: 'thin', color: { argb: '000000' } },
        left: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } },
      };
      cell.font = defaultFont;
    });
  });

  // Apply filters (autoFilter) to all headers
  worksheet.autoFilter = {
    from: 'A1',
    to: {
      row: 1,
      column: headers.length - 1,
    },
  };

  // Set the page setup for DIN A4 horizontal
  worksheet.pageSetup = {
    paperSize: 9, // 9 = A4
    orientation: 'landscape',
    fitToPage: true, // Fit the print area to one page
    margins: {
      left: 0.3,
      right: 0.3,
      top: 0.3,
      bottom: 0.3,
      header: 0,
      footer: 0,
    },
  };
};

export default {
  getWeekdays,
  createHeaders,
  createHeaderConfig,
  createWorkbook,
  createDataObject,
  createWorksheet,
};
