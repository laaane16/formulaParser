import { ValidNumberFunctionsNames } from '../types';

export const numberFunctionsToJsMap: Record<
  ValidNumberFunctionsNames,
  (args: string[]) => string
> = {
  /**
   * @function ABS
   * @description Returns the absolute value of a number.
   * @param {string[]} args - [0] - The number.
   * @returns {string} Js format ABS expression.
   * @example
   * ABS(['-5']) // => 'Math.abs(-5)'
   */
  ABS: ([num]: string[]): string => `Math.abs(${num})`,

  /**
   * @function CEIL
   * @description Rounds a number up to the nearest integer.
   * @param {string[]} args - [0] - The number.
   * @returns {string} Js format CEIL expression.
   * @example
   * CEIL(['4.2']) // => 'Math.ceil(4.2)'
   */
  CEIL: ([num]: string[]): string => `Math.ceil(${num})`,

  /**
   * @function FLOOR
   * @description Rounds a number down to the nearest integer.
   * @param {string[]} args - [0] - The number.
   * @returns {string} Js format FLOOR expression.
   * @example
   * FLOOR(['4.8']) // => 'Math.floor(4.8)'
   */
  FLOOR: ([num]: string[]): string => `Math.floor(${num})`,

  /**
   * @function EXP
   * @description Returns e raised to the power of the given number.
   * @param {string[]} args - [0] - The exponent.
   * @returns {string} Js format EXP expression.
   * @example
   * EXP(['2']) // => 'Math.exp(2)'
   */
  EXP: ([num]: string[]): string => `Math.exp(${num})`,

  /**
   * @function MOD
   * @description Returns the remainder of division of two numbers.
   * @param {string[]} args - [0] - Dividend, [1] - Divisor.
   * @returns {string} Js format MOD expression.
   * @example
   * MOD(['10', '3']) // => '(10 % 3)'
   */
  MOD: ([a, b]: string[]): string => `(${a} % ${b})`,

  /**
   * @function POWER
   * @description Raises a number to the power of another number.
   * @param {string[]} args - [0] - Base, [1] - Exponent.
   * @returns {string} Js format POWER expression.
   * @example
   * POWER(['2', '3']) // => 'Math.pow(2, 3)'
   */
  POWER: ([base, exponent]: string[]): string =>
    `Math.pow(${base}, ${exponent})`,

  /**
   * @function ROUND
   * @description Rounds a number to the nearest integer.
   * @param {string[]} args - [0] - The number.
   * @returns {string} Js format ROUND expression.
   * @example
   * ROUND(['4.6']) // => 'Math.round(4.6)'
   */
  ROUND: ([num]: string[]): string => `Math.round(${num})`,

  /**
   * @function SQRT
   * @description Returns the square root of a number.
   * @param {string[]} args - [0] - The number.
   * @returns {string} Js format SQRT expression.
   * @example
   * SQRT(['9']) // => 'Math.sqrt(9)'
   */
  SQRT: ([num]: string[]): string => `Math.sqrt(${num})`,

  /**
   * @function RANDOM
   * @description Returns a pseudo-random number between 0 (inclusive) and 1 (exclusive).
   * @param {string[]} args - No arguments required.
   * @returns {string} Js format RANDOM expression.
   * @example
   * RANDOM([]) // => 'Math.random()'
   */
  RANDOM: (args: string[]): string => `Math.random()`,
};
