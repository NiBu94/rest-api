const holidayMap = new Map([
  ['carnivalFirstWeek', '1. Woche Fasnacht'],
  ['carnivalSecondWeek', '2. Woche Fasnacht'],
  ['easterFirstWeek', '1. Woche Osterferien'],
  ['easterSecondWeek', '2. Woche Osterferien'],
  ['summerFirstWeek', '1. Woche Sommerferien'],
  ['summerSecondWeek', '2. Woche Sommerferien'],
  ['summerThirdWeek', '3. Woche Sommerferien'],
  ['summerFourthWeek', '4. Woche Sommerferien'],
  ['summerFifthWeek', '5. Woche Sommerferien'],
  ['summerSixthWeek', '6. Woche Sommerferien'],
  ['autumnFirstWeek', '1. Woche Herbstferien'],
  ['autumnSecondWeek', '2. Woche Herbstferien'],
  ['christmasFirstWeek', '1. Woche Weihnachtsferien'],
  ['christmasSecondWeek', '2. Woche Weihnachtsferien'],
]);

export const formatWeeks = (weeks) => {
  const sentences = [];
  for (const week of weeks) {
    sentences.push(`${holidayMap.get(week.name)} für ${week.days.map((day) => day.name).join(', ')}`);
  }
  return sentences;
};

export const getWeekName = (weekName) => {
  return holidayMap.get(weekName);
};
