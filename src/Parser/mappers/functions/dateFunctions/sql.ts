import { DATE_FORMATS_FORMULA, UNIT } from '../../../../constants/date';
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
    return `MAKE_DATE(${year}, ${month}, ${day})::TIMESTAMPTZ`;
  },
  SAFE_DATE: ([year, month, day]) => {
    return `(CASE WHEN ${year} >= 0 AND (${month} BETWEEN 0 AND 12) AND EXTRACT(DAY FROM MAKE_DATE(${year}, ${month}, 1) + INTERVAL '1 month' - INTERVAL '1 day') >= ${day} AND ${day} >= 0 THEN MAKE_DATE(${year}, ${month}, ${day}) ELSE NULL END)::TIMESTAMPTZ`;
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
      (CASE
        ${UNIT.map((i) => getCaseBlock(i)).join(' ')}
        ELSE (1 / 0)::text::date
      END)
    `;
  },
  SAFE_DATEADD: ([date, amount, unit]) => {
    const getCaseBlock = (val: string) => {
      return `WHEN ${unit} = '${val}' THEN (${date} + INTERVAL  '${amount} ${val}')`;
    };
    return `
      (CASE
        ${UNIT.map((i) => getCaseBlock(i)).join(' ')}
        ELSE NULL
      END)
    `;
  },
  /**
   * Calculates the difference between two timestamps in given unit.
   * @param {[string, string, string]} args - End date, start date, and unit.
   * @returns {string} SQL string.
   */
  DATETIME_DIFF: ([end, start, unit]) => {
    const getCaseBlock = (val: string) => {
      return `WHEN ${unit} = '${val}' THEN EXTRACT(${val} FROM (${end} - ${start}))`;
    };
    return `
      (CASE
        ${UNIT.map((i) => getCaseBlock(i)).join(' ')}
        ELSE 1 / 0
      END)
    `;
  },
  SAFE_DATETIME_DIFF: ([end, start, unit]) => {
    const getCaseBlock = (val: string) => {
      return `WHEN ${unit} = '${val}' THEN EXTRACT(${val} FROM (${end} - ${start}))`;
    };
    return `
      (CASE
        ${UNIT.map((i) => getCaseBlock(i)).join(' ')}
        ELSE NULL
      END)
    `;
  },
  // /**
  //  * Formats a date using a pattern.
  //  * @param {[string, string]} args - Date and format pattern.
  //  * @returns {string} SQL string.
  //  */
  DATETIME_FORMAT: ([date, format]) => {
    return `TO_CHAR(${date}, ${format})`;
  },

  // /**
  //  * Parses a date string to a timestamp using format.
  //  * @param {[string, string]} args - String and format.
  //  * @returns {string} SQL Date.
  //  */
  // DATETIME_PARSE: ([str, format]) => {
  //   const getCaseBlock = (frmt: string) =>
  //     `WHEN '${frmt}' THEN TO_TIMESTAMPTZ(${str}, ${format})`;

  //   return `CASE ${format} ${Object.values(DATE_FORMATS_FORMULA)
  //     .map((i) => getCaseBlock(format))
  //     .join(' ')} ELSE NULL END)`;
  // },

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

  /** Extracts the year from a date. */
  YEAR: ([date]) => `EXTRACT(YEAR FROM ${date})`,

  /** Extracts the month from a date. */
  MONTH: ([date]) => `EXTRACT(MONTH FROM ${date})`,

  /** Extracts the day of the week (1=Saturday..7=Sunday). */
  WEEKDAY: ([date]) => `(EXTRACT(DOW FROM ${date}) + 1)`,

  /** Extracts the ISO week number. */
  WEEKNUM: ([date]) => `EXTRACT(WEEK FROM ${date})`,

  /** Extracts the day from a date. */
  DAY: ([date]) => `EXTRACT(DAY FROM ${date})`,

  /** Extracts the minute from a date. */
  MINUTE: ([date]) => `EXTRACT(MINUTE FROM ${date})`,

  /** Extracts the hour from a date. */
  HOUR: ([date]) => `EXTRACT(HOUR FROM ${date})`,

  /** Extracts the second from a date. */
  SECOND: ([date]) => `EXTRACT(SECOND FROM ${date})`,

  /** Returns current timestamp. */
  NOW: () => `NOW()`,

  /** Returns the current date with timestamp. */
  TODAY: () => `CURRENT_DATE::TIMESTAMPTZ`,
};
