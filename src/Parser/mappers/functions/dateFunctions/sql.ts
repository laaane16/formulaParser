import { ValidDateFunctionsNames } from './types';

export const dateFunctionsToSqlMap: Record<
  ValidDateFunctionsNames,
  (args: string[]) => string
> = {
  DATE: ([date]) => {
    return `"${date}"`;
  },
  DATEADD: ([date, amount, unit]) => {
    return `(${date} + INTERVAL '${amount} ${unit}')`;
  },
  DATETIME_DIFF: ([end, start, unit]) => {
    return `(EXTRACT(EPOCH FROM (${end} - ${start})) / ${unitMultiplier(unit)})`;
  },
  DATETIME_FORMAT: ([date, format]) => {
    return `TO_CHAR(${date}, ${format})`;
  },
  DATETIME_PARSE: ([str, format]) => {
    return `TO_TIMESTAMP(${str}, ${format})`;
  },
  DAY: ([date]) => `EXTRACT(DAY FROM ${date})`,
  HOUR: ([date]) => `EXTRACT(HOUR FROM ${date})`,
  IS_AFTER: ([d1, d2]) => `(${d1} > ${d2})`,
  IS_BEFORE: ([d1, d2]) => `(${d1} < ${d2})`,
  IS_SAME: ([d1, d2]) => `(${d1} = ${d2})`,
  MINUTE: ([date]) => `EXTRACT(MINUTE FROM ${date})`,
  MONTH: ([date]) => `EXTRACT(MONTH FROM ${date})`,
  NOW: () => `NOW()`,
  SECOND: ([date]) => `EXTRACT(SECOND FROM ${date})`,
  TODAY: () => `CURRENT_DATE`,
  WEEKDAY: ([date]) => `EXTRACT(DOW FROM ${date})`,
  WEEKNUM: ([date]) => `EXTRACT(WEEK FROM ${date})`,
  YEAR: ([date]) => `EXTRACT(YEAR FROM ${date})`,
};

function unitMultiplier(unit: string): number {
  switch (unit.toLowerCase().replace(/['"]/g, '')) {
    case 'seconds':
      return 1;
    case 'minutes':
      return 60;
    case 'hours':
      return 3600;
    case 'days':
      return 86400;
    case 'weeks':
      return 604800;
    case 'months':
      return 2629800; // avg
    case 'years':
      return 31557600; // avg
    default:
      throw new Error(`Unsupported unit: ${unit}`);
  }
}
