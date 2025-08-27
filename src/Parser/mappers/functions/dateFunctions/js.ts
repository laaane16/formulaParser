import {
  UNIT,
  DATE_FORMAT,
  LUXON_EQUALITY_PSQL,
} from '../../../../constants/date';
import { IFormatterFunc } from '../types';
import { ValidDateFunctionsNamesWithSafe } from './types';

export const dateFunctionsToJsMap: Record<
  ValidDateFunctionsNamesWithSafe,
  IFormatterFunc
> = {
  /**
   * Parses a date string and returns it in ISO format.
   * @param {[string]} date - The date string in ISO format.
   * @returns {string} JavaScript expression returning ISO string.
   */
  DATE: ([year, month, day, hour, minute, second]) => {
    return `(function () {
        let dt = DateTime.fromObject({ year: ${year}, month: 1, day: 1});
        dt = dt.plus({ months: ${month} - 1, days: ${day} - 1, hours: ${hour ?? 0}, minutes: ${minute ?? 0}, seconds: ${second ?? 0} });
        return dt;
        })().toFormat(${DATE_FORMAT}).slice(0, -2)`;
  },
  SAFEDATE: ([year, month, day, hour, minute, second]) => {
    return `(function () {
        let dt = DateTime.fromObject({ year: ${year}, month: 1, day: 1});
        dt = dt.plus({ months: ${month} - 1, days: ${day} - 1, hours: ${hour ?? 0}, minutes: ${minute ?? 0}, seconds: ${second ?? 0} });
        return dt;
        })().toFormat(${DATE_FORMAT}).slice(0, -2)`;
  },

  /**
   * Adds time to a date.
   * @param {[string, number, string]} args - Date string, amount to add, and time unit.
   * @returns {string} JavaScript expression returning updated ISO string.
   */
  DATEADD: ([date, amount, unit]) => {
    const getCaseBlock = (key: string, val: string) => {
      return `if ('${key}'=== (${unit})) return DateTime.fromFormat(${date}, ${DATE_FORMAT}).plus({ '${val}': Number(${amount}) }).toFormat(${DATE_FORMAT}).slice(0, -2);`;
    };
    return `
      (function(){
        ${Object.entries(UNIT)
          .map(([key, val]) => getCaseBlock(key, val))
          .join(' ')}
        throw '';
      })()
    `;
  },
  SAFEDATEADD([date, amount, unit]) {
    const getCaseBlock = (key: string, val: string) => {
      return `if ('${key}'=== (${unit})) return DateTime.fromFormat(${date}, ${DATE_FORMAT}).plus({ '${val}': Number(${amount}) }).toFormat(${DATE_FORMAT}).slice(0, -2);`;
    };
    return `(function(){
        ${Object.entries(UNIT)
          .map(([key, val]) => getCaseBlock(key, val))
          .join(' ')}
      return null;
    })()`;
  },
  DATESUB: ([date, amount, unit]) => {
    const getCaseBlock = (key: string, val: string) => {
      return `if ('${key}'=== (${unit})) return DateTime.fromFormat(${date}, ${DATE_FORMAT}).minus({ '${val}': Number(${amount}) }).toFormat(${DATE_FORMAT}).slice(0, -2);`;
    };
    return `
      (function(){
        ${Object.entries(UNIT)
          .map(([key, val]) => getCaseBlock(key, val))
          .join(' ')}
        throw '';
      })()
    `;
  },
  SAFEDATESUB([date, amount, unit]) {
    const getCaseBlock = (key: string, val: string) => {
      return `if ('${key}'=== (${unit})) return DateTime.fromFormat(${date}, ${DATE_FORMAT}).minus({ '${val}': Number(${amount}) }).toFormat(${DATE_FORMAT}).slice(0, -2);`;
    };
    return `(function(){
        ${Object.entries(UNIT)
          .map(([key, val]) => getCaseBlock(key, val))
          .join(' ')}
      return null;
    })()`;
  },

  /**
   * Calculates the difference between two dates in the given unit.
   * @param {[string, string, string]} args - End date, start date, and unit.
   * @returns {string} JavaScript expression returning the numeric difference.
   */
  DATEDIFF: ([end, start, unit]) => {
    const getCaseBlock = (key: string, val: string) => {
      return `if ('${key}' === (${unit})) return Math.floor(Math.abs(DateTime.fromFormat(${start}, ${DATE_FORMAT}).diff(DateTime.fromFormat(${end}, ${DATE_FORMAT}), '${val}').as('${val}')));`;
    };
    return `
      (function(){
        ${Object.entries(UNIT)
          .map(([key, val]) => getCaseBlock(key, val))
          .join(' ')}
        throw '';
      })()
    `;
  },
  SAFEDATEDIFF([end, start, unit]) {
    const getCaseBlock = (key: string, val: string) => {
      return `if ('${key}' === (${unit})) return Math.floor(Math.abs(DateTime.fromFormat(${start}, ${DATE_FORMAT}).diff(DateTime.fromFormat(${end}, ${DATE_FORMAT}), '${val}').as('${val}')));`;
    };
    return `
      (function(){
        ${Object.entries(UNIT)
          .map(([key, val]) => getCaseBlock(key, val))
          .join(' ')}
        return null;
      })()
    `;
  },

  /**
   * Formats a date using a specified pattern.
   * @param {[string, string]} args - Date string and format string.
   * @returns {string} JavaScript expression returning formatted string.
   */
  // DATEFORMAT: ([date, format]) => {
  //   return `(function(){
  //   let luxonFormat = ${format};
  //   let replacedRanges = [];
  //   let formats = ${JSON.stringify(LUXON_EQUALITY_PSQL)};

  //   // сортировка по длине ключей
  //   const keys = Object.keys(formats).sort((a, b) => b.length - a.length);
  //   // экранирование спецсимволов
  //   const pattern = keys.map(k => k.replace(/([.*+?^\${}()|\\[\\]\\\\/])/g, "\\\\$1")).join("|");
  //   const regex = new RegExp(pattern, "g");

  //   luxonFormat = luxonFormat.replace(regex, (match) => formats[match]);

  //   // Object.keys(formats)
  //   //   .sort((a, b) => b.length - a.length)
  //   //   .forEach(psql => {
  //   //     const regex = new RegExp(psql, 'g');
  //   //     let match;

  //   //     while ((match = regex.exec(luxonFormat)) !== null) {
  //   //       const start = match.index;
  //   //       const end = start + match[0].length;

  //   //       if (replacedRanges.some(r => r.start < end && r.end > start)) {
  //   //         continue;
  //   //       }

  //   //       luxonFormat = luxonFormat.slice(0, start) + formats[psql] + luxonFormat.slice(end);
  //   //       regex.lastIndex = start + formats[psql].length;
  //   //       replacedRanges.push({ start, end: start + formats[psql].length });
  //   //     }
  //   //   });

  //   return DateTime.fromFormat(${date}, ${DATE_FORMAT}).toFormat(luxonFormat) })()`;
  // },

  /**
   * Parses a date string from a custom format.
   * @param {[string, string]} args - Date string and format string.
   * @returns {string} JavaScript expression returning ISO string.
   */
  // DATEPARSE: ([str, format]) => {
  //   return `DateTime.fromFormat(${str}, ${format}).toString()`;
  // },

  /** Gets the year from a date. */
  YEAR: ([date]) => {
    return `DateTime.fromFormat(${date}, ${DATE_FORMAT}).year`;
  },

  /** Gets the month from a date. */
  MONTH: ([date]) => {
    return `DateTime.fromFormat(${date}, ${DATE_FORMAT}).month`;
  },

  /** Gets the weekday from a date (1 = Monday, 7 = Saturday). */
  WEEKDAY: ([date]) => {
    return `DateTime.fromFormat(${date}, ${DATE_FORMAT}).weekday`;
  },

  /** Gets the ISO week number from a date. */
  WEEKNUM: ([date]) => {
    return `DateTime.fromFormat(${date}, ${DATE_FORMAT}).weekNumber`;
  },

  /**
   * Gets the day of the month from a date.
   * @param {[string]} date - Date string.
   * @returns {string} JavaScript expression returning the day number.
   */
  DAY: ([date]) => {
    return `DateTime.fromFormat(${date}, ${DATE_FORMAT}).day`;
  },

  /** Gets the hour from a date. */
  HOUR: ([date]) => {
    return `DateTime.fromFormat(${date}, ${DATE_FORMAT}).hour`;
  },

  /** Gets the minute from a date. */
  MINUTE: ([date]) => {
    return `DateTime.fromFormat(${date}, ${DATE_FORMAT}).minute`;
  },

  /** Gets the second from a date. */
  SECOND: ([date]) => {
    return `DateTime.fromFormat(${date}, ${DATE_FORMAT}).second`;
  },
  QUARTER: ([date]) => `DateTime.fromFormat(${date}, ${DATE_FORMAT}).quarter`,

  /**
   * Returns the current timestamp in ISO format.
   * @returns {string} JavaScript expression returning current date in ISO.
   */
  // NOW: () => {
  //   return `DateTime.now().toFormat(${DATE_FORMAT}).slice(0, -2)`;
  // },

  /**
   * Returns the current date (start of day) in ISO format.
   * @returns {string} JavaScript expression returning today's date in ISO.
   */
  // TODAY: () => {
  //   return `DateTime.now().startOf('day').toFormat(${DATE_FORMAT}).slice(0, -2)`;
  // },

  SETYEAR: ([date, year]) =>
    `DateTime.fromFormat(${date}, ${DATE_FORMAT}).set({year: ${year}}).toFormat(${DATE_FORMAT}).slice(0, -2)`,
  SETQUARTER: ([date, quarter]) =>
    `DateTime.fromFormat(${date}, ${DATE_FORMAT}).set({month: ((${quarter}) - 1) * 3 + 1}).toFormat(${DATE_FORMAT}).slice(0, -2)`,
  SETMONTH: ([date, month]) =>
    `DateTime.fromFormat(${date}, ${DATE_FORMAT}).set({month: ${month}}).toFormat(${DATE_FORMAT}).slice(0, -2)`,
  SETDAY: ([date, day]) =>
    `DateTime.fromFormat(${date}, ${DATE_FORMAT}).set({day: ${day}}).toFormat(${DATE_FORMAT}).slice(0, -2)`,
  SETWEEKNUM: ([date, weeknum]) =>
    `DateTime.fromFormat(${date}, ${DATE_FORMAT}).set({weekNumber: ${weeknum}}).toFormat(${DATE_FORMAT}).slice(0, -2)`,
  SETWEEKDAY: ([date, weekday]) =>
    `DateTime.fromFormat(${date}, ${DATE_FORMAT}).set({weekday: ${weekday}}).toFormat(${DATE_FORMAT}).slice(0, -2)`,
  SETTIME: ([date, hour, min, sec]) =>
    `DateTime.fromFormat(${date}, ${DATE_FORMAT}).set({hour: ${hour}, minute: ${min}, second: ${sec}}).toFormat(${DATE_FORMAT}).slice(0, -2)`,
  SETHOUR: ([date, hour]) =>
    `DateTime.fromFormat(${date}, ${DATE_FORMAT}).set({hour: ${hour}}).toFormat(${DATE_FORMAT}).slice(0, -2)`,
  SETMINUTE: ([date, min]) =>
    `DateTime.fromFormat(${date}, ${DATE_FORMAT}).set({minute: ${min}}).toFormat(${DATE_FORMAT}).slice(0, -2)`,
  SETSECOND: ([date, sec]) =>
    `DateTime.fromFormat(${date}, ${DATE_FORMAT}).set({second: ${sec}}).toFormat(${DATE_FORMAT}).slice(0, -2)`,

  STARTOF([date, unit]) {
    const getCaseBlock = (key: string, val: string) => {
      return `if ('${key}'=== (${unit})) return DateTime.fromFormat(${date}, ${DATE_FORMAT}).startOf('${val}').toFormat(${DATE_FORMAT}).slice(0, -2);`;
    };
    return `(function(){
        ${Object.entries(UNIT)
          .map(([key, val]) => getCaseBlock(key, val))
          .join(' ')}
      return null;
    })()`;
  },
  ENDOF([date, unit]) {
    const getCaseBlock = (key: string, val: string) => {
      return `if ('${key}'=== (${unit})) return DateTime.fromFormat(${date}, ${DATE_FORMAT}).endOf('${val}').toFormat(${DATE_FORMAT}).slice(0, -2);`;
    };
    return `(function(){
        ${Object.entries(UNIT)
          .map(([key, val]) => getCaseBlock(key, val))
          .join(' ')}
      return null;
    })()`;
  },
  TIMESTAMP: ([date]) =>
    `DateTime.fromFormat(${date}, ${DATE_FORMAT}).toUnixInteger()`,
};
