import { UNIT } from '../../../../constants/date';
import { IFormatterFunc } from '../types';
import { ValidDateFunctionsNamesWithSafe } from './types';

export const dateFunctionsToSqlMap: Record<
  ValidDateFunctionsNamesWithSafe,
  IFormatterFunc
> = {
  /**
   * Returns the raw date expression.
   * @param {[string]} date - Date SQL expression.
   * @returns {string} SQL string.
   */
  DATE: ([year, month, day, hour, minute, second]) => {
    return `MAKE_TIMESTAMP(${year}, ${month}, ${day}, ${hour ?? 0}, ${minute ?? 0}, ${second ?? 0})::TIMESTAMPTZ`;
  },
  SAFEDATE: ([year, month, day, hour, minute, second]) => {
    return `(MAKE_DATE(${year}, 1, 1)
        + ((${month}) - 1) * interval '1 month'
        + ((${day}) - 1) * interval '1 day'
        + (${hour ?? 0}) * interval '1 hour'
        + (${minute ?? 0}) * interval '1 minute'
        + (${second ?? 0}) * interval '1 second')::TIMESTAMPTZ`;
  },

  /**
   * Adds a time interval to a date.
   * @param {[string, string, string]} args - Date, amount, and unit.
   * @returns {string} SQL string.
   */
  DATEADD: ([date, amount, unit]) => {
    const getCaseBlock = (key: string, val: string) => {
      return `WHEN '${key}' THEN ((${date}) + ((${amount}) || ' ${val}')::INTERVAL)`;
    };
    return `
      (CASE (${unit})
        ${Object.entries(UNIT)
          .map(([key, val]) => getCaseBlock(key, val))
          .join(' ')}
        ELSE (1 / 0)::text::date
      END)
    `;
  },
  SAFEDATEADD: ([date, amount, unit]) => {
    const getCaseBlock = (key: string, val: string) => {
      return `WHEN '${key}' THEN ((${date}) + ((${amount}) || ' ${val}')::INTERVAL)`;
    };
    return `
      (CASE (${unit})
        ${Object.entries(UNIT)
          .map(([key, val]) => getCaseBlock(key, val))
          .join(' ')}
        ELSE NULL
      END)
    `;
  },
  DATESUB: ([date, amount, unit]) => {
    const getCaseBlock = (key: string, val: string) => {
      return `WHEN '${key}' THEN ((${date}) - ((${amount}) || ' ${val}')::INTERVAL)`;
    };
    return `
      (CASE (${unit})
        ${Object.entries(UNIT)
          .map(([key, val]) => getCaseBlock(key, val))
          .join(' ')}
        ELSE (1 / 0)::text::date
      END)
    `;
  },
  SAFEDATESUB: ([date, amount, unit]) => {
    const getCaseBlock = (key: string, val: string) => {
      return `WHEN '${key}' THEN ((${date}) - ((${amount}) || ' ${val}')::INTERVAL)`;
    };
    return `
      (CASE (${unit})
        ${Object.entries(UNIT)
          .map(([key, val]) => getCaseBlock(key, val))
          .join(' ')}
        ELSE NULL
      END)
    `;
  },
  /**
   * Calculates the difference between two timestamps in given unit.
   * @param {[string, string, string]} args - End date, start date, and unit.
   * @returns {string} SQL string.
   */
  DATEDIFF: ([end, start, unit]) => {
    return `ABS(CASE (${unit})
      WHEN 'y' THEN ABS(EXTRACT(YEAR FROM AGE(${start}, ${end})))
      WHEN 'm' THEN ABS(EXTRACT(YEAR FROM AGE(${start}, ${end})) * 12) + EXTRACT(MONTH FROM AGE(${start}, ${end}))
      WHEN 'd' THEN
          FLOOR((EXTRACT(EPOCH FROM (${start})) - EXTRACT(EPOCH FROM (${end}))) / 86400)
      WHEN 'hh' THEN
          FLOOR((EXTRACT(EPOCH FROM (${start})) - EXTRACT(EPOCH FROM (${end}))) / 3600)
      WHEN 'mm' THEN
          FLOOR((EXTRACT(EPOCH FROM (${start})) - EXTRACT(EPOCH FROM (${end}))) / 60)
      WHEN 'ss' THEN
          FLOOR(EXTRACT(EPOCH FROM (${start})) - EXTRACT(EPOCH FROM (${end})))
      ELSE 1 / 0
    END)`;
  },
  SAFEDATEDIFF: ([end, start, unit]) => {
    return `ABS(CASE (${unit})
      WHEN 'y' THEN ABS(EXTRACT(YEAR FROM AGE(${start}, ${end})))
      WHEN 'm' THEN ABS(EXTRACT(YEAR FROM AGE(${start}, ${end})) * 12) + EXTRACT(MONTH FROM AGE(${start}, ${end}))
      WHEN 'w' THEN
          FLOOR((EXTRACT(EPOCH FROM (${start})) - EXTRACT(EPOCH FROM (${end}))) / 604800)
      WHEN 'd' THEN
          FLOOR((EXTRACT(EPOCH FROM (${start})) - EXTRACT(EPOCH FROM (${end}))) / 86400)
      WHEN 'hh' THEN
          FLOOR((EXTRACT(EPOCH FROM (${start})) - EXTRACT(EPOCH FROM (${end}))) / 3600)
      WHEN 'mm' THEN
          FLOOR((EXTRACT(EPOCH FROM (${start})) - EXTRACT(EPOCH FROM (${end}))) / 60)
      WHEN 'ss' THEN
          FLOOR(EXTRACT(EPOCH FROM (${start})) - EXTRACT(EPOCH FROM (${end})))
      ELSE NULL
    END)`;
  },
  /**
   * Formats a date using a pattern.
   * @param {[string, string]} args - Date and format pattern.
   * @returns {string} SQL string.
   */
  DATEFORMAT: ([date, format]) => {
    return `TO_CHAR(${date}, ${format})`;
  },

  // /**
  //  * Parses a date string to a timestamp using format.
  //  * @param {[string, string]} args - String and format.
  //  * @returns {string} SQL Date.
  //  */
  DATEPARSE: ([str, format]) =>
    `BPIUMDATEPARSE(${str}, ${format})::TIMESTAMPTZ`,

  /** Extracts the year from a date. */
  YEAR: ([date]) => `EXTRACT(YEAR FROM ${date})`,

  /** Extracts the month from a date. */
  MONTH: ([date]) => `EXTRACT(MONTH FROM ${date})`,

  /** Extracts the day of the week (1=Saturday..7=Sunday). */
  WEEKDAY: ([date]) =>
    `(CASE WHEN EXTRACT(DOW FROM ${date}) = 0 THEN 7 ELSE EXTRACT(DOW FROM ${date}) END)`,

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

  QUARTER: ([date]) => `EXTRACT(QUARTER FROM ${date})`,

  /** Returns current timestamp. */
  // NOW: () => `NOW()`,

  /** Returns the current date with timestamp. */
  // TODAY: () => `CURRENT_DATE::TIMESTAMPTZ`,

  SETYEAR: ([date, year]) =>
    `(${date} + MAKE_INTERVAL(YEARS := (${year})::INT - EXTRACT(YEAR FROM (${date}))::INT))`,
  SETQUARTER: ([date, quarter]) =>
    `(${date} + MAKE_INTERVAL(MONTHS := (((${quarter}) - 1) * 3 + 1)::INT - EXTRACT(MONTH FROM (${date}))::INT))`,
  SETMONTH: ([date, month]) =>
    `(${date} + MAKE_INTERVAL(MONTHS := (${month})::INT - EXTRACT(MONTH FROM (${date}))::INT))`,
  SETDAY: ([date, day]) =>
    `(${date} + MAKE_INTERVAL(DAYS := (${day})::INT - EXTRACT(DAY FROM (${date}))::INT))`,
  SETWEEKNUM: ([date, weeknum]) =>
    `(${date} + MAKE_INTERVAL(WEEKS := (${weeknum})::INT - EXTRACT(WEEK FROM (${date}))::INT))`,
  SETWEEKDAY: ([date, weekday]) =>
    `(${date} + MAKE_INTERVAL(DAYS := (${weekday})::INT - (CASE WHEN EXTRACT(DOW FROM ${date}) = 0 THEN 7 ELSE EXTRACT(DOW FROM ${date}) END)::INT))`,
  SETTIME: ([date, hour, min, sec]) =>
    `(${date} + MAKE_INTERVAL(HOURS := ((${hour})::INT - EXTRACT(HOUR FROM (${date}))::INT), MINS := ((${min})::INT - EXTRACT(MINUTE FROM (${date}))::INT), SECS := ((${sec})::INT - FLOOR(EXTRACT(SECOND FROM (${date}))))))`,
  SETHOUR: ([date, hour]) =>
    `(${date} + MAKE_INTERVAL(HOURS := (${hour})::INT - EXTRACT(HOUR FROM (${date}))::INT))`,
  SETMINUTE: ([date, minute]) =>
    `(${date} + MAKE_INTERVAL(MINS := (${minute})::INT - EXTRACT(MINUTE FROM (${date}))::INT))`,
  SETSECOND: ([date, second]) =>
    `(${date} + MAKE_INTERVAL(SECS := (${second})::INT - FLOOR(EXTRACT(SECOND FROM (${date})))))`,

  STARTOF: ([date, unit]) => {
    const getCaseBlock = (key: string, val: string) => {
      return `WHEN '${key}' THEN DATE_TRUNC('${val}', ${date})`;
    };
    return `(CASE (${unit})
        ${Object.entries(UNIT)
          .map(([key, val]) => getCaseBlock(key, val))
          .join(' ')}
        ELSE NULL
      END)`;
  },
  ENDOF: ([date, unit]) => {
    const getCaseBlock = (key: string, val: string) => {
      return `WHEN '${key}' THEN (DATE_TRUNC('${val}', ${date}) + INTERVAL '1 ${val}' - INTERVAL '1 second')`;
    };
    return `(CASE (${unit})
        ${Object.entries(UNIT)
          .map(([key, val]) => getCaseBlock(key, val))
          .join(' ')}
        ELSE NULL
      END)`;
  },

  TIMESTAMP: ([date]) => `EXTRACT(EPOCH FROM ${date})`,
};
