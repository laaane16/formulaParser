import { ValidDateFunctionsNames } from './types';

export const dateFunctionsToSqlMap: Record<
  ValidDateFunctionsNames,
  (args: string[]) => string
> = {
  /**
   * Returns the raw date expression.
   * @param {[string]} date - Date SQL expression.
   * @returns {string} SQL string.
   */
  DATE: ([year, month, day]) => {
    return `'${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}'`;
  },

  /**
   * Adds a time interval to a date.
   * @param {[string, string, string]} args - Date, amount, and unit.
   * @returns {string} SQL string.
   */
  DATEADD: ([date, amount, unit]) => {
    return `(${date} + INTERVAL '${amount} ${unit.slice(1, -1)}')`;
  },

  /**
   * Calculates the difference between two timestamps in given unit.
   * @param {[string, string, string]} args - End date, start date, and unit.
   * @returns {string} SQL string.
   */
  DATETIME_DIFF: ([end, start, unit]) => {
    return `(EXTRACT(EPOCH FROM (${end} - ${start})) / ${unitMultiplier(unit)})`;
  },

  /**
   * Formats a date using a pattern.
   * @param {[string, string]} args - Date and format pattern.
   * @returns {string} SQL string.
   */
  DATETIME_FORMAT: ([date, format]) => {
    return `TO_CHAR(${date}, ${format})`;
  },

  /**
   * Parses a date string to a timestamp using format.
   * @param {[string, string]} args - String and format.
   * @returns {string} SQL string.
   */
  DATETIME_PARSE: ([str, format]) => {
    return `TO_TIMESTAMP(${str}, ${format})`;
  },

  /** Extracts the day from a date. */
  DAY: ([date]) => `EXTRACT(DAY FROM ${date})`,

  /** Extracts the hour from a date. */
  HOUR: ([date]) => `EXTRACT(HOUR FROM ${date})`,

  /**
   * Checks if first date is after second.
   * @param {[string, string]} args - Two date expressions.
   * @returns {string} SQL boolean.
   */
  IS_AFTER: ([d1, d2]) => `(${d1} > ${d2})`,

  /**
   * Checks if first date is before second.
   * @param {[string, string]} args - Two date expressions.
   * @returns {string} SQL boolean.
   */
  IS_BEFORE: ([d1, d2]) => `(${d1} < ${d2})`,

  /**
   * Checks if two dates are equal.
   * @param {[string, string]} args - Two date expressions.
   * @returns {string} SQL boolean.
   */
  IS_SAME: ([d1, d2]) => `(${d1} = ${d2})`,

  /** Extracts the minute from a date. */
  MINUTE: ([date]) => `EXTRACT(MINUTE FROM ${date})`,

  /** Extracts the month from a date. */
  MONTH: ([date]) => `EXTRACT(MONTH FROM ${date})`,

  /** Returns current timestamp. */
  NOW: () => `NOW()`,

  /** Extracts the second from a date. */
  SECOND: ([date]) => `EXTRACT(SECOND FROM ${date})`,

  /** Returns the current date (without time). */
  TODAY: () => `CURRENT_DATE`,

  /** Extracts the day of the week (0=Sunday..6=Saturday). */
  WEEKDAY: ([date]) => `EXTRACT(DOW FROM ${date})`,

  /** Extracts the ISO week number. */
  WEEKNUM: ([date]) => `EXTRACT(WEEK FROM ${date})`,

  /** Extracts the year from a date. */
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
      return 2629800;
    case 'years':
      return 31557600;
    default:
      throw new Error(`Unsupported unit: ${unit}`);
  }
}
