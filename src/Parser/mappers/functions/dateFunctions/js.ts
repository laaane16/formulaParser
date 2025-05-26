import {
  DATE_FORMATS_LUXON,
  DATE_FORMATS_FORMULA,
  UNIT,
} from '../../../../constants/date';
import { ValidDateFunctionsNamesWithSafe } from './types';

export const dateFunctionsToJsMap: Record<
  ValidDateFunctionsNamesWithSafe,
  (args: string[]) => string
> = {
  /**
   * Parses a date string and returns it in ISO format.
   * @param {[string]} date - The date string in ISO format.
   * @returns {string} JavaScript expression returning ISO string.
   */
  DATE: ([year, month, day]) => {
    return `DateTime.fromObject({ day: ${day}, month:  ${month}, year: ${year}}, { zone: 'utc'}).toString()`;
  },
  SAFE_DATE: ([year, month, day]) => {
    return `(function(){const dt = DateTime.fromObject({ day: ${day}, month:  ${month}, year: ${year}}, { zone: 'utc'}); if (dt.isValid) return dt.toString(); return null})()`;
  },

  /**
   * Adds time to a date.
   * @param {[string, number, string]} args - Date string, amount to add, and time unit.
   * @returns {string} JavaScript expression returning updated ISO string.
   */
  DATEADD: ([date, amount, unit]) => {
    const getCaseBlock = (val: string) => {
      return `if ('${val}'=== ${unit}) return DateTime.fromISO(${date}, { zone: 'utc'}).plus({ [${unit}]: Number(${amount}) }).toString();`;
    };
    return `
      (function(){
        ${UNIT.map((i) => getCaseBlock(i)).join(' ')}
        throw '';
      })()
    `;
  },
  SAFE_DATEADD([date, amount, unit]) {
    const getCaseBlock = (val: string) => {
      return `if ('${val}'=== ${unit}) return DateTime.fromISO(${date}, { zone: 'utc'}).plus({ [${unit}]: Number(${amount}) }).toString();`;
    };
    return `(function(){
      ${UNIT.map((i) => getCaseBlock(i)).join(' ')}
      return null;
    })()`;
  },

  /**
   * Calculates the difference between two dates in the given unit.
   * @param {[string, string, string]} args - End date, start date, and unit.
   * @returns {string} JavaScript expression returning the numeric difference.
   */
  DATETIME_DIFF: ([end, start, unit]) => {
    const getCaseBlock = (val: string) => {
      return `if ('${val}' === ${unit}) return Math.floor(Math.abs(DateTime.fromISO(${start}, { zone: 'utc'}).diff(DateTime.fromISO(${end}), ${unit}).as(${unit})));`;
    };
    return `
      (function(){
        ${UNIT.map((i) => getCaseBlock(i)).join(' ')}
        throw '';
      })()
    `;
  },
  SAFE_DATETIME_DIFF([end, start, unit]) {
    const getCaseBlock = (val: string) => {
      return `if ('${val}' === ${unit}) return Math.floor(Math.abs(DateTime.fromISO(${start}, { zone: 'utc'}).diff(DateTime.fromISO(${end}), ${unit}).as(${unit})));`;
    };
    return `
      (function(){
        ${UNIT.map((i) => getCaseBlock(i)).join(' ')}
        return null;
      })()
    `;
  },

  /**
   * Formats a date using a specified pattern.
   * @param {[string, string]} args - Date string and format string.
   * @returns {string} JavaScript expression returning formatted string.
   */
  DATETIME_FORMAT: ([date, format]) => {
    const jsonFormulaFormats = JSON.stringify(DATE_FORMATS_FORMULA);
    const jsonLuxonFormats = JSON.stringify(DATE_FORMATS_LUXON);

    return `(function(){
    let preparedFormat = ${format};
    Object.entries(${jsonFormulaFormats}).forEach(
      ([key, value]) => {
        const matches = ${format}.match(new RegExp(value, 'g'));
        if (matches && matches.length > 0) {
          preparedFormat = ${format}.replaceAll(value, ${jsonLuxonFormats}[key]);
        }
      }
    );
    return DateTime.fromISO(${date}, { zone: 'utc'}).toFormat(preparedFormat)})()`;
  },

  // /**
  //  * Parses a date string from a custom format.
  //  * @param {[string, string]} args - Date string and format string.
  //  * @returns {string} JavaScript expression returning ISO string.
  //  */
  // DATETIME_PARSE: ([str, format]) => {
  //   return `DateTime.fromFormat(${str}, ${format}, { zone: 'utc'}).toString()`;
  // },

  /** Gets the year from a date. */
  YEAR: ([date]) => {
    return `DateTime.fromISO(${date}, { zone: 'utc'}).year`;
  },

  /** Gets the month from a date. */
  MONTH: ([date]) => {
    return `DateTime.fromISO(${date}, { zone: 'utc'}).month`;
  },

  /** Gets the weekday from a date (1 = Saturday, 7 = Sunday). */
  WEEKDAY: ([date]) => {
    return `DateTime.fromISO(${date}, { zone: 'utc'}).weekday`;
  },

  /** Gets the ISO week number from a date. */
  WEEKNUM: ([date]) => {
    return `DateTime.fromISO(${date}, { zone: 'utc'}).weekNumber`;
  },

  /**
   * Gets the day of the month from a date.
   * @param {[string]} date - Date string.
   * @returns {string} JavaScript expression returning the day number.
   */
  DAY: ([date]) => {
    return `DateTime.fromISO(${date}, { zone: 'utc'}).day`;
  },

  /** Gets the hour from a date. */
  HOUR: ([date]) => {
    return `DateTime.fromISO(${date}, { zone: 'utc'}).hour`;
  },

  /** Gets the minute from a date. */
  MINUTE: ([date]) => {
    return `DateTime.fromISO(${date}, { zone: 'utc'}).minute`;
  },

  /** Gets the second from a date. */
  SECOND: ([date]) => {
    return `DateTime.fromISO(${date}, { zone: 'utc'}).second`;
  },

  /**
   * Checks if the first date is after the second.
   * @param {[string, string]} args - Two date strings.
   * @returns {string} JavaScript expression returning boolean.
   */
  IS_AFTER: ([a, b]) => {
    return `DateTime.fromISO(${a}, { zone: 'utc'}) > DateTime.fromISO(${b}, { zone: 'utc'})`;
  },

  /**
   * Checks if the first date is before the second.
   * @param {string[]} args - Two date strings.
   * @returns {string} JavaScript expression returning boolean.
   */
  IS_BEFORE: ([a, b]) => {
    return `DateTime.fromISO(${a}, { zone: 'utc'}) < DateTime.fromISO(${b}, { zone: 'utc'})`;
  },

  /**
   * Checks if two dates are the same.
   * @param {[string, string]} args - Two date strings.
   * @returns {string} JavaScript expression returning boolean.
   */
  IS_SAME: ([a, b]) => {
    return `DateTime.fromISO(${a}, { zone: 'utc'}).toString() === DateTime.fromISO(${b}, { zone: 'utc'}).toString()`;
  },

  /**
   * Returns the current timestamp in ISO format.
   * @returns {string} JavaScript expression returning current date in ISO.
   */
  NOW: () => {
    return `DateTime.now().toString()`;
  },

  /**
   * Returns the current date (start of day) in ISO format.
   * @returns {string} JavaScript expression returning today's date in ISO.
   */
  TODAY: () => {
    return `DateTime.now().startOf('day').toString()`;
  },
};
