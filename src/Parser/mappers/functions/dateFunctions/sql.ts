import { UNIT } from '../../../../constants/date';
import { ValidDateFunctionsNamesWithSafe } from './types';

export const dateFunctionsToSqlMap: Record<
  ValidDateFunctionsNamesWithSafe,
  (args: string[]) => string
> = {
  /**
   * Returns the raw date expression.
   * @param {[string]} date - Date SQL expression.
   * @returns {string} SQL string.
   */
  DATE: ([year, month, day]) => {
    return `MAKE_DATE(${year}, ${month}, ${day})`;
  },

  /**
   * Adds a time interval to a date.
   * @param {[string, string, string]} args - Date, amount, and unit.
   * @returns {string} SQL string.
   */
  DATEADD: ([date, amount, unit]) => {
    const getCaseBlock = (val: string) => {
      return `WHEN ${unit} = '${val}' THEN (${date} + INTERVAL  '${amount} ${val}')`;
    };
    return `
      CASE
        ${UNIT.map((i) => getCaseBlock(i)).join(' ')}
        ELSE 1 / 0
      END
    `;
  },
  SAFE_DATEADD: ([date, amount, unit]) => {
    const getCaseBlock = (val: string) => {
      return `WHEN ${unit} = '${val}' THEN (${date} + INTERVAL  '${amount} ${val}')`;
    };
    return `
      CASE
        ${UNIT.map((i) => getCaseBlock(i)).join(' ')}
        ELSE NULL
      END
    `;
  },
  /**
   * Calculates the difference between two timestamps in given unit.
   * @param {[string, string, string]} args - End date, start date, and unit.
   * @returns {string} SQL string.
   */
  DATETIME_DIFF: ([end, start, unit]) => {
    const getCaseBlock = (val: string) => {
      return `WHEN ${unit} = '${val}' EXTRACT(${val} FROM (${end} - ${start}))`;
    };
    return `
      CASE
        ${UNIT.map((i) => getCaseBlock(i)).join(' ')}
        ELSE 1 / 0
      END
    `;
  },
  SAFE_DATETIME_DIFF: ([end, start, unit]) => {
    const getCaseBlock = (val: string) => {
      return `WHEN ${unit} = '${val}' EXTRACT(${val} FROM (${end} - ${start}))`;
    };
    return `
      CASE
        ${UNIT.map((i) => getCaseBlock(i)).join(' ')}
        ELSE NULL
      END
    `;
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
