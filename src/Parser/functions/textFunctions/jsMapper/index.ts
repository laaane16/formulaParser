/**
 *  * In this file we work with strings - NODE_STRING_TYPE as ""!!!
 */

import { ValidTextFunctionsNames } from '../types';

export const textFunctionsToJsMap: Record<
  ValidTextFunctionsNames,
  // move this type in functions/types
  (args: string[]) => string
> = {
  /**
   * @function CONCAT
   * @description Concatenates all arguments into a single string. NULL values are ignored.
   * @param {string[]} args - Array of strings to concatenate.
   * @returns {string} Js format CONCAT expression.
   * @example
   * CONCAT(['"Hello"', '" "', '"World"']) // => '("Hello" + " " + "World")'
   */
  CONCAT: (args: string[]): string => `${args.join(' + ')}`,

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
    const escapeRegExp = (s: string): string =>
      s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = escapeRegExp(chars.slice(1, -1));

    if (position === 'leading') {
      return `${str}.replace(new RegExp('^(${pattern})+)', '')`;
    } else if (position === 'trailing') {
      return `${str}.replace(new RegExp('(${pattern})+$)', '')`;
    } else {
      return `${str}.replace(new RegExp('^(${pattern})+|(${pattern})+$', 'g'), '')`;
    }
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
  SEARCH: (args: string[]): string => {
    return `${args[1]}.indexOf(${args[0]}) + 1`;
  },

  /**
   * @function REPLACE
   * @description Replaces all occurrences of a substring with another substring.
   * @param {string[]} args -
   *   [0] - The original string,
   *   [1] - The substring to replace,
   *   [2] - The replacement substring.
   * @returns {string} Js format REPLACE expression.
   * @example
   * REPLACE(['"banana"', '"a"', '"o"']) // => '"banana".replace(/a/g, "o")'
   */
  REPLACE: ([str, search, replace]: string[]): string => {
    const escapeRegExp = (s: string): string =>
      s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const escapedSearch = escapeRegExp(search.slice(1, -1));
    return `${str}.replace(new RegExp('${escapedSearch}', 'g'), ${replace})`;
  },

  /**
   * @function LOWER
   * @description Converts a string to lowercase.
   * @param {string[]} args -
   *   [0] - The input string.
   * @returns {string} Js format LOWER expression.
   * @example
   * LOWER(['"HELLO"']) // => '"HELLO".toLowerCase()'
   */
  LOWER: ([str]: string[]): string => `${str}.toLowerCase()`,

  /**
   * @function UPPER
   * @description Converts a string to uppercase.
   * @param {string[]} args -
   *   [0] - The input string.
   * @returns {string} Js format UPPER expression.
   * @example
   * UPPER(['"hello"']) // => '"hello".toUpperCase()'
   */
  UPPER: ([str]: string[]): string => `${str}.toUpperCase()`,

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
  REPEAT: ([str, count]: string[]): string => `${str}.repeat(${count})`,

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
    `${str}.slice(${+start - 1}, ${+start - 1} + ${length})`,

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
  LEFT: ([str, count]: string[]): string => `${str}.slice(0, ${count})`,

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
  RIGHT: ([str, count]: string[]): string => `${str}.slice(-${count})`,

  /**
   * @function LEN
   * @description Returns the number of characters in a string.
   * @param {string[]} args -
   *   [0] - The input string.
   * @returns {string} Js format LENGTH expression.
   * @example
   * LEN(['"hello"']) // => '"hello".length'
   */
  LEN: ([str]: string[]): string => `${str}.length`,
};
