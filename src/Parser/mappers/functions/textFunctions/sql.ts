/**
 * In this file we work with strings - NODE_STRING_TYPE as ''!!!
 */

import { IFormatterFunc } from '../types';
import { ValidTextFunctionsNamesWithSafe } from './types';

export const textFunctionsToSqlMap: Record<
  ValidTextFunctionsNamesWithSafe,
  IFormatterFunc
> = {
  /**
   * @function CONCAT
   * @description Concatenates all arguments into a single string. NULL values are ignored.
   * @param {string[]} args - Array of strings to concatenate.
   * @returns {string} PostgreSQL CONCAT expression.
   * @example
   * CONCAT(["'Hello'", "'World'"]) // => "CONCAT('Hello', 'World')"
   */
  CONCAT: (args: string[]): string => `CONCAT(${args})`,

  /**
   * @function TRIM
   * @description Removes specific characters from the beginning, end, or both sides of a string.
   * @param {string[]} args -
   *   [0] - Direction ('leading', 'trailing', 'both'),
   *   [1] - Characters to trim (as a string),
   *   [2] - The target string.
   * @returns {string} PostgreSQL TRIM expression.
   * @example
   * TRIM(["'both'", "'x'", "'xxabcxx'"]) // => "TRIM(both 'x' from 'xxabcxxs')"
   */
  TRIM: ([position, chars, str]: string[]): string =>
    `
      (CASE (${position})
        WHEN 'leading' THEN TRIM(LEADING (${chars}) FROM (${str}))
        WHEN 'trailing' THEN TRIM(TRAILING (${chars}) FROM (${str}))
        WHEN 'both' THEN TRIM(BOTH (${chars}) FROM (${str}))
        ELSE CAST(1 / 0 AS TEXT)
      END)
    `,
  SAFETRIM: ([position, chars, str]: string[]): string => {
    return `
      (CASE (${position})
        WHEN 'leading' THEN TRIM(LEADING (${chars}) FROM (${str}))
        WHEN 'trailing' THEN TRIM(TRAILING (${chars}) FROM (${str}))
        WHEN 'both' THEN TRIM(BOTH (${chars}) FROM (${str}))
        ELSE NULL
      END)
    `;
  },

  /**
   * @function SEARCH
   * @description Returns the position of the first occurrence of a substring in a string.
   * @param {string[]} args -
   *   [0] - The substring to search for,
   *   [1] - The string to search in.
   * @returns {string} PostgreSQL POSITION expression.
   * @example
   * SEARCH(["'abc'", "'abcde'"]) // => "POSITION('abc' in 'abcde')"
   */
  SEARCH: ([str, substr]: string[]): string =>
    `(POSITION((${substr}) in (${str})) - 1)`,

  /**
   * @function REPLACE
   * @description Replaces all occurrences of a substring with another substring.
   * @param {string[]} args -
   *   [0] - The original string,
   *   [1] - The substring to replace,
   *   [2] - The replacement substring.
   * @returns {string} PostgreSQL REPLACE expression.
   * @example
   * REPLACE(["'abcabc'", "'a'", "'x'"]) // => "REPLACE('abcabc', 'a', 'x')"
   */
  REPLACE: (args: string[]): string => `REPLACE(${args})`,

  /**
   * @function LOWER
   * @description Converts a string to lowercase.
   * @param {string[]} args -
   *   [0] - The input string.
   * @returns {string} PostgreSQL LOWER expression.
   * @example
   * LOWER(["'HELLO'"]) // => "LOWER('HELLO')"
   */
  LOWER: (args: string[]): string => `LOWER(${args})`,

  /**
   * @function UPPER
   * @description Converts a string to uppercase.
   * @param {string[]} args -
   *   [0] - The input string.
   * @returns {string} PostgreSQL UPPER expression.
   * @example
   * UPPER(["'hello'"]) // => "UPPER('hello')"
   */
  UPPER: (args: string[]): string => `UPPER(${args})`,

  /**
   * @function REPEAT
   * @description Repeats a string a specified number of times.
   * @param {string[]} args -
   *   [0] - The input string,
   *   [1] - Number of times to repeat.
   * @returns {string} PostgreSQL REPEAT expression.
   * @example
   * REPEAT(["'x'", "3"]) // => "REPEAT('x', 3)"
   */
  REPEAT: (args: string[]): string => `REPEAT(${args})`,

  /**
   * @function SUBSTRING
   * @description Extracts a substring from a string, starting at a position for a specified length.
   * @param {string[]} args -
   *   [0] - The input string,
   *   [1] - Start position (0-based),
   *   [2] - Length of the substring.
   * @returns {string} PostgreSQL SUBSTRING expression.
   * @example
   * SUBSTRING(["'abcdef'", '2', '3']) // => "SUBSTRING('abcdef' from 2 for 3)"
   */
  SUBSTRING: (args: string[]): string =>
    `SUBSTRING((${args[0]}) from (CASE WHEN (${args[1]}) >= 0 THEN (${args[1]}) + 1 ELSE 1 END) for (CASE WHEN (${args[1]}) >= 0 AND (${args[2]}) > 0 THEN (${args[2]}) ELSE 0 END))`,

  /**
   * @function LEFT
   * @description Extracts the leftmost characters from a string.
   * @param {string[]} args -
   *   [0] - The input string,
   *   [1] - Number of characters to extract.
   * @returns {string} PostgreSQL LEFT expression.
   * @example
   * LEFT(["'abcdef'", "3"]) // => "LEFT('abcdef', 3)"
   */
  LEFT: (args: string[]): string =>
    `LEFT((${args[0]}), CASE WHEN (${args[1]}) > 0 THEN (${args[1]}) ELSE 0 END)`,

  /**
   * @function RIGHT
   * @description Extracts the rightmost characters from a string.
   * @param {string[]} args -
   *   [0] - The input string,
   *   [1] - Number of characters to extract.
   * @returns {string} PostgreSQL RIGHT expression.
   * @example
   * RIGHT(["'abcdef'", "2"]) // => "RIGHT('abcdef', 2)"
   */
  RIGHT: (args: string[]): string =>
    `RIGHT((${args[0]}), CASE WHEN (${args[1]}) > 0 THEN (${args[1]}) ELSE 0 END)`,

  /**
   * @function LEN
   * @description Returns the number of characters in a string.
   * @param {string[]} args -
   *   [0] - The input string.
   * @returns {string} PostgreSQL LENGTH expression.
   * @example
   * LEN(["'hello'"]) // => "LEN('hello')" (might be LENGTH in real PostgreSQL)
   */
  LEN: (args: string[]): string => `LENGTH(${args})`,

  // /**
  //  * @function JOIN
  //  * @param {string[]} args -
  //  *  [0] - separator
  //  *  [1, ...] - values
  //  * @returns {string} Sql format LENGTH expression.
  //  * @example
  //  * JOIN(['","', '"1"', '1']) // => 'CONCAT_WS(',', '1', 1)'
  //  */
  // JOIN: ([sep, ...vals]) => `CONCAT_WS(${sep}, ${vals})`,

  /**
   * @function TOSTRING
   * @param {string[]} args - value
   * @returns {string} Sql format TOSTRING expression.
   * @example
   * TOSTRING([1]) // => '1::text'
   */
  TOSTRING: ([val]) => `(${val})::text`,
  DATETOSTRING: ([val]) =>
    `TO_CHAR(${val}, 'YYYY-MM-DD"T"HH24:MI:SS.MSTZH:TZM')`,
};
