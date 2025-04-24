import { ValidDateFunctionsNames } from './types';

export const dateFunctionsToJsMap: Record<
  ValidDateFunctionsNames,
  (args: string[]) => string
> = {
  /**
   * Parses a date string and returns it in ISO format.
   * @param {[string]} date - The date string in ISO format.
   * @returns {string} JavaScript expression returning ISO string.
   */
  DATE: ([date]) => {
    return `DateTime.fromISO(${date}).toISO()`;
  },

  /**
   * Adds time to a date.
   * @param {[string, number, string]} args - Date string, amount to add, and time unit.
   * @returns {string} JavaScript expression returning updated ISO string.
   */
  DATEADD: ([date, amount, unit]) => {
    return `DateTime.fromISO(${date}).plus({ [${unit}]: Number(${amount}) }).toISO()`;
  },

  /**
   * Calculates the difference between two dates in the given unit.
   * @param {[string, string, string]} args - End date, start date, and unit.
   * @returns {string} JavaScript expression returning the numeric difference.
   */
  DATETIME_DIFF: ([end, start, unit]) => {
    return `DateTime.fromISO(${end}).diff(DateTime.fromISO(${start}), ${unit}).as(${unit})`;
  },

  /**
   * Formats a date using a specified pattern.
   * @param {[string, string]} args - Date string and format string.
   * @returns {string} JavaScript expression returning formatted string.
   */
  DATETIME_FORMAT: ([date, format]) => {
    return `DateTime.fromISO(${date}).toFormat(${format})`;
  },

  /**
   * Parses a date string from a custom format.
   * @param {[string, string]} args - Date string and format string.
   * @returns {string} JavaScript expression returning ISO string.
   */
  DATETIME_PARSE: ([str, format]) => {
    return `DateTime.fromFormat(${str}, ${format}).toISO()`;
  },

  /**
   * Gets the day of the month from a date.
   * @param {[string]} date - Date string.
   * @returns {string} JavaScript expression returning the day number.
   */
  DAY: ([date]) => {
    return `DateTime.fromISO(${date}).day`;
  },

  /** Gets the hour from a date. */
  HOUR: ([date]) => {
    return `DateTime.fromISO(${date}).hour`;
  },

  /** Gets the minute from a date. */
  MINUTE: ([date]) => {
    return `DateTime.fromISO(${date}).minute`;
  },

  /** Gets the second from a date. */
  SECOND: ([date]) => {
    return `DateTime.fromISO(${date}).second`;
  },

  /** Gets the month from a date. */
  MONTH: ([date]) => {
    return `DateTime.fromISO(${date}).month`;
  },

  /** Gets the year from a date. */
  YEAR: ([date]) => {
    return `DateTime.fromISO(${date}).year`;
  },

  /** Gets the weekday from a date (1 = Monday, 7 = Sunday). */
  WEEKDAY: ([date]) => {
    return `DateTime.fromISO(${date}).weekday`;
  },

  /** Gets the ISO week number from a date. */
  WEEKNUM: ([date]) => {
    return `DateTime.fromISO(${date}).weekNumber`;
  },

  /**
   * Checks if the first date is after the second.
   * @param {[string, string]} args - Two date strings.
   * @returns {string} JavaScript expression returning boolean.
   */
  IS_AFTER: ([a, b]) => {
    return `DateTime.fromISO(${a}) > DateTime.fromISO(${b})`;
  },

  /**
   * Checks if the first date is before the second.
   * @param {string[]} args - Two date strings.
   * @returns {string} JavaScript expression returning boolean.
   */
  IS_BEFORE: ([a, b]) => {
    return `DateTime.fromISO(${a}) < DateTime.fromISO(${b})`;
  },

  /**
   * Checks if two dates are the same.
   * @param {[string, string]} args - Two date strings.
   * @returns {string} JavaScript expression returning boolean.
   */
  IS_SAME: ([a, b]) => {
    return `DateTime.fromISO(${a}).toISO() === DateTime.fromISO(${b}).toISO()`;
  },

  /**
   * Returns the current timestamp in ISO format.
   * @returns {string} JavaScript expression returning current date in ISO.
   */
  NOW: () => {
    return `DateTime.now().toISO()`;
  },

  /**
   * Returns the current date (start of day) in ISO format.
   * @returns {string} JavaScript expression returning today's date in ISO.
   */
  TODAY: () => {
    return `DateTime.now().startOf('day').toISO()`;
  },
};
