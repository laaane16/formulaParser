import { ValidNumberFunctionsNames } from '../types';

export const numberFunctionsToSqlMap: Record<
  ValidNumberFunctionsNames,
  (args: string[]) => string
> = {
  /**
   * @function ABS
   * @description Returns the absolute value of a number.
   * @param {string[]} args - [0] - The number.
   * @returns {string} Sql format ABS expression.
   * @example ABS(['-5']) => "ABS(-5)"
   */
  ABS: ([num]: string[]): string => `ABS(${num})`,

  /**
   * @function CEIL
   * @description Rounds a number up to the nearest integer.
   * @param {string[]} args - [0] - The number.
   * @returns {string} Sql format CEIL expression.
   * @example CEIL(['4.2']) => "CEIL(4.2)"
   */
  CEIL: ([num]: string[]): string => `CEIL(${num})`,

  /**
   * @function FLOOR
   * @description Rounds a number down to the nearest integer.
   * @param {string[]} args - [0] - The number.
   * @returns {string} Sql format FLOOR expression.
   * @example FLOOR(['4.8']) => "FLOOR(4.8)"
   */
  FLOOR: ([num]: string[]): string => `FLOOR(${num})`,

  /**
   * @function EXP
   * @description Returns e raised to the power of the given number.
   * @param {string[]} args - [0] - The exponent.
   * @returns {string} Sql format EXP expression.
   * @example EXP(['2']) => "EXP(2)"
   */
  EXP: ([num]: string[]): string => `EXP(${num})`,

  /**
   * @function MOD
   * @description Returns the remainder of division of two numbers.
   * @param {string[]} args - [0] - Dividend, [1] - Divisor.
   * @returns {string} Sql format MOD expression.
   * @example MOD(['10', '3']) => "MOD(10, 3)"
   */
  MOD: ([a, b]: string[]): string => `MOD(${a}, ${b})`,

  /**
   * @function POWER
   * @description Raises a number to the power of another number.
   * @param {string[]} args - [0] - Base, [1] - Exponent.
   * @returns {string} Sql format POWER expression.
   * @example POWER(['2', '3']) => "POWER(2, 3)"
   */
  POWER: ([base, exponent]: string[]): string => `POWER(${base}, ${exponent})`,

  /**
   * @function ROUND
   * @description Rounds a number to the nearest integer.
   * @param {string[]} args - [0] - The number.
   * @returns {string} Sql format ROUND expression.
   * @example ROUND(['4.6']) => "ROUND(4.6)"
   */
  ROUND: ([num]: string[]): string => `ROUND(${num})`,

  /**
   * @function SQRT
   * @description Returns the square root of a number.
   * @param {string[]} args - [0] - The number.
   * @returns {string} Sql format SQRT expression.
   * @example SQRT(['9']) => "SQRT(9)"
   */
  SQRT: ([num]: string[]): string => `SQRT(${num})`,

  /**
   * @function RANDOM
   * @description Returns a random value between 0 and 1.
   * @param {string[]} args - No arguments required.
   * @returns {string} Sql format RANDOM expression.
   * @example RANDOM([]) => "RANDOM()"
   */
  RANDOM: (): string => `RANDOM()`,
};
