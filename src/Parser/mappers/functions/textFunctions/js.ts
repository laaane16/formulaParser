/**
 *  * In this file we work with strings - NODE_STRING_TYPE as ""!!!
 */

import { DATE_FORMAT } from '../../../../constants/date';
import { IFormatterFunc } from '../types';
import { ValidTextFunctionsNamesWithSafe } from './types';

export const textFunctionsToJsMap: Record<
  ValidTextFunctionsNamesWithSafe,
  // move this type in functions/types
  IFormatterFunc
> = {
  /**
   * @function CONCAT
   * @description Concatenates all arguments into a single string. NULL values are ignored.
   * @param {string[]} args - Array of strings to concatenate.
   * @returns {string} Js format CONCAT expression.
   * @example
   * CONCAT(['"Hello"', '" "', '"World"']) // => '("Hello" + " " + "World")'
   */
  CONCAT: (args: string[]): string =>
    `[${args}].filter(v => v).reduce((accum, i) => accum + String(i), "")`,

  REGEXMATCH: ([str, regex, mode]: string[]): string =>
    `(function(){try{return (new RegExp(${regex}, ((${mode}) === 1 ? 'i': ''))).test(${str})}catch(e){if (e.message.match('Invalid regular expression')) return null; throw e}})()`,
  REGEXREPLACE: ([str, regex, replacement, mode]) =>
    `(function(){try{return (${str}).replace(new RegExp(${regex}, ((${mode}) === 1 ? 'g': '')), ${replacement})}catch(e){if (e.message.match('Invalid regular expression')) return null; throw e}})()`,

  /**
   * @function TRIM
   * @description Removes specific characters from the beginning, end, or both sides of a string.
   * @param {string[]} args -
   *   [0] - Direction ('leading', 'trailing', 'both'),
   *   [1] - Characters to trim (as a string),
   *   [2] - The target string.
   * @returns {string} Js format TRIM expression.
   * @example TRIM(['"both"', '"x"', '"xxabcxx"']) // => '"xxabcxx".replace(/^(x)+|(x)+$/g, "")'
   */
  TRIM: ([position, chars, str]: string[]): string => {
    return `(function(){
      const pattern = (${chars}).replace(/[.*+?^$}{()|[\\]]/g, '\\\\$&');
      if ((${position}) === 'leading') {
        return (${str}).replace(new RegExp('^[' + pattern + ']+'), '');
      } else if ((${position}) === 'trailing') {
        return (${str}).replace(new RegExp('[' + pattern + ']+$'), '');
      } else if ((${position}) === 'both') {
        return (${str}).replace(new RegExp('^[' + pattern + ']+|[' + pattern + ']+$', 'g'), '');
      }
      throw '';
    })()`;
  },
  SAFETRIM([position, chars, str]: string[]) {
    return `(function(){
      const pattern = (${chars}).replace(/[.*+?^$}{()|[\\]]/g, '\\\\$&');
      if ((${position}) === 'leading') {
        return (${str}).replace(new RegExp('^[' + pattern + ']+'), '');
      } else if ((${position}) === 'trailing') {
        return (${str}).replace(new RegExp('[' + pattern + ']+$'), '');
      } else if ((${position}) === 'both') {
        return (${str}).replace(new RegExp('^[' + pattern + ']+|[' + pattern + ']+$', 'g'), '');
      }
      return null;
    })()`;
  },

  /**
   * @function SEARCH
   * @description Returns the position of the first occurrence of a substring in a string.
   * @param {string[]} args -
   *   [0] - The substring to search for,
   *   [1] - The string to search in.
   * @returns {string} Js format POSITION expression.
   * @example
   * SEARCH(['"lo"', '"Hello"']) // => '"Hello".indexOf("lo") + 1'
   */
  SEARCH: ([str, substr]): string => {
    return `(${str}).indexOf(${substr})`;
  },

  /**
   * @function REPLACE
   * @description Replaces all occurrences of a substring with another substring.t
   * @param {string[]} args -
   *   [0] - The original string,
   *   [1] - The substring to replace,
   *   [2] - The replacement substring.
   * @returns {string} Js format REPLACE expression.
   * @example
   * REPLACE(['"banana"', '"a"', '"o"']) // => '"banana".replace(/a/g, "o")'
   */
  REPLACE: ([str, search, replace]: string[]): string =>
    `((${search}).length > 0 ? (${str}).replace(new RegExp((${search}).replace(/[.*+?^$}{()|[\\]]/g, '\\\\$&'), 'g'), ${replace}) : ${str})`,

  /**
   * @function LOWER
   * @description Converts a string to lowercase.
   * @param {string[]} args -
   *   [0] - The input string.
   * @returns {string} Js format LOWER expression.
   * @example
   * LOWER(['"HELLO"']) // => '"HELLO".toLowerCase()'
   */
  LOWER: ([str]: string[]): string => `(${str}).toLowerCase()`,

  /**
   * @function UPPER
   * @description Converts a string to uppercase.
   * @param {string[]} args -
   *   [0] - The input string.
   * @returns {string} Js format UPPER expression.
   * @example
   * UPPER(['"hello"']) // => '"hello".toUpperCase()'
   */
  UPPER: ([str]: string[]): string => `(${str}).toUpperCase()`,

  /**
   * @function REPEAT
   * @description Repeats a string a specified number of times.
   * @param {string[]} args -
   *   [0] - The input string,
   *   [1] - Number of times to repeat.
   * @returns {string} Js format REPEAT expression.
   * @example
   * REPEAT(['"x"', "3"]) // => '"x".repeat(3)'
   */
  REPEAT: ([str, count]: string[]): string =>
    `((${count}) >= 0 ? (${str}).repeat(${count}) : '')`,

  /**
   * @function SUBSTRING
   * @description Extracts a substring from a string, starting at a position for a specified length.
   * @param {string[]} args -
   *   [0] - The input string,
   *   [1] - Start position (1-based),
   *   [2] - Length of the substring.
   * @returns {string} Js format SUBSTRING expression.
   * @example
   * SUBSTRING(['"abcdef"', "2", "3"]) // => '"abcdef".slice(1, 1 + 3)'
   */
  SUBSTRING: ([str, start, length]: string[]): string =>
    length
      ? `(${str}).slice((${start}) >= 0 ? (${start}) : 0, (${start}) >= 0 && (${length}) > 0? (${start}) + (${length}) : 0)`
      : `(${str}).slice((${start}) >= 0 ? (${start}) : 0)`,
  /**
   * @function LEFT
   * @description Extracts the leftmost characters from a string.
   * @param {string[]} args -
   *   [0] - The input string,
   *   [1] - Number of characters to extract.
   * @returns {string} Js format LEFT expression.
   * @example
   * LEFT(['"abcdef"', "2"]) // => '"abcdef".slice(0, 2)'
   */
  LEFT: ([str, count]: string[]): string =>
    `(${str}).slice(0, (${count}) > 0 ? (${count}) : 0)`,

  /**
   * @function RIGHT
   * @description Extracts the rightmost characters from a string.
   * @param {string[]} args -
   *   [0] - The input string,
   *   [1] - Number of characters to extract.
   * @returns {string} Js format RIGHT expression.
   * @example
   * RIGHT(['"abcdef"', "3"]) // => '"abcdef".slice(-3)'
   */
  RIGHT: ([str, count]: string[]): string =>
    `(${str}).slice((${count}) > 0 ? (${count}) * (-1): (${str}).length)`,

  /**
   * @function LEN
   * @description Returns the number of characters in a string.
   * @param {string[]} args -
   *   [0] - The input string.
   * @returns {string} Js format LEN expression.
   * @example
   * LEN(['"hello"']) // => '"hello".length'
   */
  LEN: ([str]: string[]): string => `(${str}).length`,

  /**
   * @function JOIN
   * @param {string[]} args -
   *  [0] - separator
   *  [1, ...] - values
   * @returns {string} Js format JOIN expression.
   * @example
   * JOIN(['","', '"1"', '1']) // => 'ARRAY_TO_STRING(['1', '1'], ",")'
   */
  JOIN: ([vals, sep]) => `${vals}.filter(v => v).join(${sep})`,
  JOINFORITEMS: ([vals, sep, attr]) =>
    attr
      ? `(((${attr}) === 'id' || (${attr}) === 'title') ? (${vals}).map(i => i[${attr}]).filter(v => v).join(${sep}): null)`
      : `(${vals}).map(i => i.name).filter(v => v).join(${sep})`,

  /**
   * @function TOSTRING
   * @param {string[]} args - value
   * @returns {string} Js format TOSTRING expression.
   * @example
   * TOSTRING([1]) // => 'String(1)'
   */
  TOSTRING: ([val]) =>
    `(Array.isArray(${val}) ? ('{' + String(${val}) + '}'): String(${val}))`,
  DATETOSTRING: ([val]) =>
    `DateTime.fromFormat(${val}, ${DATE_FORMAT}).toISO()`,
  BOOLEANARRAYTOSTRING: ([val]) =>
    `('{' + String((${val}).map(i => String(i)[0])) + '}')`,
  // TODO: add attr support
  ARRAYWITHITEMSNODETOSTRING: ([val]) =>
    `('{' + String((${val}).map(i => i.id)) + '}')`,
};
