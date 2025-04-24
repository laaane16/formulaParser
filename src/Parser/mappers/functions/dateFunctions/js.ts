import { ValidDateFunctionsNames } from './types';

export const dateFunctionsToJsMap: Record<
  ValidDateFunctionsNames,
  (args: string[]) => string
> = {
  DATE: ([date]) => {
    return `DateTime.fromISO(${date}).toISO()`;
  },
  DATEADD: ([date, amount, unit]) => {
    return `DateTime.fromISO(${date}).plus({ [${unit}]: Number(${amount}) }).toISO()`;
  },
  DATETIME_DIFF: ([end, start, unit]) => {
    return `DateTime.fromISO(${end}).diff(DateTime.fromISO(${start}), ${unit}).as(${unit})`;
  },
  DATETIME_FORMAT: ([date, format]) => {
    return `DateTime.fromISO(${date}).toFormat(${format})`;
  },
  DATETIME_PARSE: ([str, format]) => {
    return `DateTime.fromFormat(${str}, ${format}).toISO()`;
  },
  DAY: ([date]) => {
    return `DateTime.fromISO(${date}).day`;
  },
  HOUR: ([date]) => {
    return `DateTime.fromISO(${date}).hour`;
  },
  MINUTE: ([date]) => {
    return `DateTime.fromISO(${date}).minute`;
  },
  SECOND: ([date]) => {
    return `DateTime.fromISO(${date}).second`;
  },
  MONTH: ([date]) => {
    return `DateTime.fromISO(${date}).month`;
  },
  YEAR: ([date]) => {
    return `DateTime.fromISO(${date}).year`;
  },
  WEEKDAY: ([date]) => {
    return `DateTime.fromISO(${date}).weekday`;
  },
  WEEKNUM: ([date]) => {
    return `DateTime.fromISO(${date}).weekNumber`;
  },
  IS_AFTER: ([a, b]) => {
    return `DateTime.fromISO(${a}) > DateTime.fromISO(${b})`;
  },
  IS_BEFORE: ([a, b]) => {
    return `DateTime.fromISO(${a}) < DateTime.fromISO(${b})`;
  },
  IS_SAME: ([a, b]) => {
    return `DateTime.fromISO(${a}).toISO() === DateTime.fromISO(${b}).toISO()`;
  },
  NOW: () => {
    return `DateTime.now().toISO()`;
  },
  TODAY: () => {
    return `DateTime.now().startOf('day').toISO()`;
  },
};
