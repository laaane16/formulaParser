import { roundedSql } from '../../../../lib/roundedNums';
import { IFormatterFunc } from '../types';
import { ValidNumberFunctionsNamesWithSafe } from './types';

export const numberFunctionsToSqlMap: Record<
  ValidNumberFunctionsNamesWithSafe,
  IFormatterFunc
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
  CEIL: ([num, dig]: string[]): string =>
    `(CEIL((${num}) * (10 ^ (${dig ?? 0}))) / (10 ^ (${dig ?? 0})))`,

  /**
   * @function FLOOR
   * @description Rounds a number down to the nearest integer.
   * @param {string[]} args - [0] - The number.
   * @returns {string} Sql format FLOOR expression.
   * @example FLOOR(['4.8']) => "FLOOR(4.8)"
   */
  FLOOR: ([num, dig]: string[]): string =>
    `(FLOOR((${num}) * (10 ^ (${dig ?? 0}))) / (10 ^ (${dig ?? 0})))`,

  /**
   * @function ROUND
   * @description Rounds a number to the nearest integer.
   * @param {string[]} args - [0] - The number.
   * @returns {string} Sql format ROUND expression.
   * @example ROUND(['4.6']) => "ROUND(4.6)"
   */
  ROUND: ([num, dig]: string[]): string =>
    `(ROUND((${num}) * (10 ^ (${dig ?? 0}))) / (10 ^ (${dig ?? 0})))`,

  /**
   * @function EXP
   * @description Returns e raised to the power of the given number.
   * @param {string[]} args - [0] - The exponent.
   * @returns {string} Sql format EXP expression.
   * @example EXP(['2']) => "EXP(2)"
   */
  EXP: ([num]: string[]): string => roundedSql(`EXP(${num})`),

  /**
   * @function MOD
   * @description Returns the remainder of division of two numbers.
   * @param {string[]} args - [0] - Dividend, [1] - Divisor.
   * @returns {string} Sql format MOD expression.
   * @example MOD(['10', '3']) => "MOD(10, 3)"
   */
  MOD: ([a, b]: string[]): string => roundedSql(`MOD(${a}, ${b})`),
  SAFEMOD: ([a, b]: string[]): string =>
    `(CASE WHEN (${b}) != 0 THEN ${roundedSql(`(MOD(${a}, ${b})`)} ELSE NULL END)`,

  /**
   * @function POWER
   * @description Raises a number to the power of another number.
   * @param {string[]} args - [0] - Base, [1] - Exponent.
   * @returns {string} Sql format POWER expression.
   * @example POWER(['2', '3']) => "POWER(2, 3)"
   */
  POWER: ([base, exponent]: string[]): string =>
    roundedSql(`POWER(${base}, ${exponent})`),

  /**
   * @function SQRT
   * @description Returns the square root of a number.
   * @param {string[]} args - [0] - The number.
   * @returns {string} Sql format SQRT expression.
   * @example SQRT(['9']) => "SQRT(9)"
   */
  SQRT: ([num]: string[]): string => roundedSql(`SQRT(${num})`),
  SAFESQRT: ([num]: string[]): string =>
    `(CASE WHEN ${num} >= 0 THEN ${roundedSql(`SQRT(${num})`)} ELSE NULL END)`,

  /**
   * @function RANDOM
   * @description Returns a random value between 0 and 1.
   * @param {string[]} args - No arguments required.
   * @returns {string} Sql format RANDOM expression.
   * @example RANDOM([]) => "RANDOM()"
   */
  RANDOM: (): string => `RANDOM()::NUMERIC`,

  /**
   * @function SUM
   * @description Returns sum numbers in args
   * @param {string[]} args - Numbers for sum
   * @returns {string} Sql format SUM expression.
   * @example
   * SUM(['1','2']) // => '1 + 2'
   */
  SUM: (args: string[]): string => roundedSql(`((${args.join(') + (')}))`),

  /**
   * @function AVERAGE
   * @description Returns average num from args
   * @param {string[]} args - Numbers for sum
   * @returns {string} Sql format AVERAGE expression.
   * @example
   * AVERAGE(['1','2']) // => '(1 + 2) / 2'
   */
  AVERAGE: (args: string[]): string =>
    roundedSql(`(((${args.join(') + (')})) / (${args.length}))`),

  /**
   * @function MAX
   * @description Returns max num from args
   * @param {string[]} args - Numbers for sum
   * @returns {string} Sql format MAX expression.
   * @example
   * MAX(['1','2']) // => 'GREATEST(1, 2)'
   */
  MAX: (args: string[]): string => `GREATEST(${args})`,

  /**
   * @function SUM
   * @description Returns min num from args
   * @param {string[]} args - Numbers for sum
   * @returns {string} Sql format MIN expression.
   * @example
   * MIN(['1','2']) // => 'LEAST(1, 2)'
   */
  MIN: (args: string[]): string => `LEAST(${args})`,

  /**
   * @function TONUMBER
   * @description Returns num if it`s possible
   * @param {string[]} args - Numeric cast
   * @returns {string} Sql format numeric cas expression.
   * @example
   * TONUMBER(["'1'"]) // => "'1'::numeric"
   */
  TONUMBER: (args: string[]): string => `(${args})::numeric`,
  SAFETONUMBER: (args: string[]): string =>
    `(CASE WHEN (${args})::text ~ '^[-]*\\d+(\\.\\d+)?$' THEN (${args})::text::numeric WHEN (${args})::text ~ 'true' THEN 1 WHEN (${args})::text ~ 'false' THEN 0 ELSE NULL END)`,

  SIN: ([x]) => roundedSql(`SIN(${x})::NUMERIC`),
  COS: ([x]) => roundedSql(`COS(${x})::NUMERIC`),
  TAN: ([x]) => roundedSql(`TAN(${x})::NUMERIC`),
  COT: ([x]) => roundedSql(`COT(${x})::NUMERIC`),
  ASIN: ([x]) =>
    `(CASE WHEN (${x}) >= - 1 AND (${x}) <= 1 THEN ${roundedSql(`ASIN(${x})::NUMERIC`)} ELSE NULL END)`,
  ACOS: ([x]) =>
    `(CASE WHEN (${x}) >= - 1 AND (${x}) <= 1 THEN ${roundedSql(`ACOS(${x})::NUMERIC`)} ELSE NULL END)`,
  ATAN: ([x]) => roundedSql(`ATAN(${x})::NUMERIC`),
  ACOT: ([x]) => roundedSql(`(PI() / 2 - ATAN(${x}))::NUMERIC`),
  PI: () => roundedSql(`PI()::NUMERIC`),
  LN: ([a]) =>
    `(CASE WHEN (${a}) > 0 THEN ${roundedSql(`LN(${a})::NUMERIC`)} ELSE NULL END)`,
  LOG: ([a, b]) =>
    `(CASE WHEN (${a}) > 0 AND (${b}) > 0 AND (${a}) != 1 THEN ${roundedSql(`LOG(${a}, ${b})::NUMERIC`)} ELSE NULL END)`,
  LOG10: ([a]) =>
    `(CASE WHEN (${a}) > 0 THEN ${roundedSql(`LOG(${a})::NUMERIC`)} ELSE NULL END)`,

  FIXED: ([num, decimals]) =>
    decimals
      ? `((REGEXP_REPLACE(SPLIT_PART(ROUND(${num}, ${decimals})::TEXT, '.', 1), '(\\d)(?=(\\d{3})+(?!\\d))', '\\1 ', 'g') || COALESCE(NULLIF('.' || SPLIT_PART(ROUND(${num}, ${decimals})::TEXT, '.', 2), '.'), '')))`
      : `((REGEXP_REPLACE(SPLIT_PART((${num})::TEXT, '.', 1), '(\\d)(?=(\\d{3})+(?!\\d))', '\\1 ', 'g') || COALESCE(NULLIF('.' || SPLIT_PART((${num})::TEXT, '.', 2), '.'), '')))`,
};
