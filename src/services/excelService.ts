import ExcelJS from 'exceljs';
import { formatDate } from '../modules/formatDate';

const getWeekDays = () => {
  return {
    carnivalFirstWeek: ['Mo', 'Di', 'Mi', 'Do', 'Fr'],
    carnivalSecondWeek: ['Mo', 'Di', 'Mi', 'Do', 'Fr'],
    easterFirstWeek: ['Mo', 'Di', 'Mi', 'Do'],
    easterSecondWeek: ['Di', 'Mi', 'Do', 'Fr'],
    summerFirstWeek: ['Mo', 'Di', 'Mi', 'Do', 'Fr'],
    summerSecondWeek: ['Mo', 'Di', 'Mi', 'Do', 'Fr'],
    summerThirdWeek: ['Mo', 'Di', 'Mi', 'Do', 'Fr'],
    summerFourthWeek: ['Mo', 'Di', 'Mi', 'Do', 'Fr'],
    summerFifthWeek: ['Mo', 'Di', 'Mi', 'Do', 'Fr'],
    summerSixtWeek: ['Mo', 'Di', 'Mi', 'Do', 'Fr'],
    autumnFirstWeek: ['Mo', 'Di', 'Mi', 'Do', 'Fr'],
    autumnSecondWeek: ['Mo', 'Di', 'Mi', 'Do', 'Fr'],
    christmasFirstWeek: ['Mi', 'Do', 'Fr'],
    christmasSecondWeek: ['Di', 'Mi', 'Do', 'Fr'],
  };
};
const defaultFont = {
  name: 'Calibri',
  size: 10,
  color: { argb: 'FF000000' },
};

const createHeaders = (weekDays) => {
  const arr = [];
  arr.push('Nachname', 'Vorname', 'm/w', 'Geburtstag', 'Allergien', 'Alleine nach Hause');
  arr.push(weekDays);
  arr.push('Telefon 1', 'Telefon 2', 'Email', 'Zusatzbetreuung', 'Betrag bezahlt');
  return arr;
};

const createHeaderConfig = (headers) => {
  const headerConfig = headers.map((header) => {
    let width;
    if (['Mo', 'Di', 'Mi', 'Do', 'Fr'].includes(header)) {
      width = 5; // Very narrow columns for single-character values
    } else if (header === 'm/w') {
      width = 6; // Narrow column for 'm' or 'w'
    } else if (header === 'Geburtstag') {
      width = 12; // Standard date format
    } else if (header === 'Alleine nach Hause') {
      width = 6.5; // Slightly wider to accommodate line break in header
    } else {
      width = 15; // Default width for other columns
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

const createDataObject = (
  lastName,
  firstName,
  gender,
  birthday,
  allergies,
  allowanceToGoHomeAlone,
  weekDays,
  telephone1,
  telephone2,
  additionalCare,
  amountPaid
) => {
  const obj = {
    Nachname: lastName,
    Vorname: firstName,
    'm/w': gender === 'männlich' ? 'm' : 'w',
    Geburtstag: formatDate(birthday),
    Allergien: allergies ? allergies : 'keine',
    'Alleine nach Hause': allowanceToGoHomeAlone,
  };
  for (const weekDay of weekDays) {
    obj[weekDay];
  }
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
      left: 0.7,
      right: 0.7,
      top: 0.75,
      bottom: 0.75,
      header: 0.3,
      footer: 0.3,
    },
  };

  return worksheet;
};

const writeFile = async (workbook, res) => await workbook.xlsx.writeFile(res);

export default {
  getWeekDays,
  createHeaders,
  createHeaderConfig,
  createWorkbook,
  createWorksheet,
  writeFile,
};
