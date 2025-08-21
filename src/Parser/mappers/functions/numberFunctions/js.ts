import { IFormatterFunc } from '../types';
import { ValidNumberFunctionsNamesWithSafe } from './types';

export const numberFunctionsToJsMap: Record<
  ValidNumberFunctionsNamesWithSafe,
  IFormatterFunc
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
  CEIL: ([num, dig]: string[]): string =>
    `(Math.ceil((${num}) * (10 ** (${dig ?? 0}))) / (10 ** (${dig ?? 0})))`,

  /**
   * @function FLOOR
   * @description Rounds a number down to the nearest integer.
   * @param {string[]} args - [0] - The number.
   * @returns {string} Js format FLOOR expression.
   * @example
   * FLOOR(['4.8']) // => 'Math.floor(4.8)'
   */
  FLOOR: ([num, dig]: string[]): string =>
    `(Math.floor((${num}) * (10 ** (${dig ?? 0}))) / (10 ** (${dig ?? 0})))`,

  /**
   * @function ROUND
   * @description Rounds a number to the nearest integer.
   * @param {string[]} args - [0] - The number.
   * @returns {string} Js format ROUND expression.
   * @example
   * ROUND(['4.6']) // => 'Math.round(4.6)'
   */
  ROUND: ([num, dig]: string[]): string =>
    `(Math.round((${num}) * (10 ** (${dig ?? 0}))) / (10 ** (${dig ?? 0})))`,

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
  SAFEMOD: ([a, b]: string[]): string =>
    `(function(){if ((${b}) === 0) return null; return ${a} % ${b}})()`,

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
   * @function SQRT
   * @description Returns the square root of a number.
   * @param {string[]} args - [0] - The number.
   * @returns {string} Js format SQRT expression.
   * @example
   * SQRT(['9']) // => 'Math.sqrt(9)'
   */
  SQRT: ([num]: string[]): string => `Math.sqrt(${num})`,
  SAFESQRT: ([num]: string[]): string =>
    `(function(){if ((${num}) < 0) return null; return Math.sqrt(${num})})()`,

  /**
   * @function RANDOM
   * @description Returns a pseudo-random number between 0 (inclusive) and 1 (exclusive).
   * @param {string[]} args - No arguments required.
   * @returns {string} Js format RANDOM expression.
   * @example
   * RANDOM([]) // => 'Math.random()'
   */
  RANDOM: (args: string[]): string => `Math.random()`,

  /**
   * @function SUM
   * @description Returns sum numbers in args
   * @param {string[]} args - Numbers for sum
   * @returns {string} Js format SUM expression.
   * @example
   * SUM(['1','2']) // => '1 + 2'
   */
  SUM: (args: string[]): string => `(${args.join(' + ')})`,

  /**
   * @function AVERAGE
   * @description Returns average num from args
   * @param {string[]} args - Numbers for sum
   * @returns {string} Js format AVERAGE expression.
   * @example
   * AVERAGE(['1','2']) // => '(1 + 2) / 2'
   */
  AVERAGE: (args: string[]): string =>
    `((${args.join(' + ')}) / ${args.length})`,

  /**
   * @function MAX
   * @description Returns max num from args
   * @param {string[]} args - Numbers for sum
   * @returns {string} Js format MAX expression.
   * @example
   * MAX(['1','2']) // => 'Math.max(1, 2)'
   */
  MAX: (args: string[]): string => `Math.max(${args})`,

  /**
   * @function SUM
   * @description Returns min num from args
   * @param {string[]} args - Numbers for sum
   * @returns {string} Js format MIN expression.
   * @example
   * MIN(['1','2']) // => 'Math.min(1, 2)'
   */
  MIN: (args: string[]): string => `Math.min(${args})`,

  /**
   * @function TONUMBER
   * @description Returns num if it`s possible
   * @param {string[]} args - Numeric cast
   * @returns {string} Sql format numeric cas expression.
   * @example
   * TONUMBER(["'1'"]) // => "Number('1')"
   */
  TONUMBER: (args: string[]): string => `Number(${args})`,
  SAFETONUMBER: (args: string[]): string =>
    `(function(){ if (Number.isNaN(Number(${args}))) {if (String(${args}) === 'true') return 1;if (String(${args}) === 'false') return 0; return null}; return Number(${args})})()`,

  SIN: ([x]) => `Number(Math.sin(${x}).toFixed(15).replace(/\\.?0+$/, ''))`,
  COS: ([x]) => `Number(Math.cos(${x}).toFixed(15).replace(/\\.?0+$/, ''))`,
  TAN: ([x]) => `Number(Math.tan(${x}).toFixed(15).replace(/\\.?0+$/, ''))`,
  COT: ([x]) =>
    `Number((1 / Math.tan(${x})).toFixed(15).replace(/\\.?0+$/, ''))`,
  ASIN: ([x]) =>
    `(function (){if ((${x}) >= - 1 && (${x}) <= 1) return Number(Math.asin(${x}).toFixed(15).replace(/\\.?0+$/, '')); return null})()`,
  ACOS: ([x]) =>
    `(function (){if ((${x}) >= - 1 && (${x}) <= 1) return Number(Math.acos(${x}).toFixed(15).replace(/\\.?0+$/, '')); return null})()`,
  ATAN: ([x]) => `Number(Math.atan(${x}).toFixed(15).replace(/\\.?0+$/, ''))`,
  ACOT: ([x]) =>
    `Number((Math.PI / 2 - Math.atan(${x})).toFixed(15).replace(/\\.?0+$/, ''))`,
  PI: () => `Number(Math.PI.toFixed(14))`,
  LN: ([a]) =>
    `((${a}) > 0 ? Number(Math.log(${a}).toFixed(14).replace(/\\.?0+$/, '')): null)`,
  LOG: ([a, b]) =>
    `(((${a}) > 0 && (${a}) !== 1 && (${b}) > 0)  ? Number(Math.log(${b}) / Math.log(${a}).toFixed(14).replace(/\\.?0+$/, '')): null)`,
  LOG10: ([a]) =>
    `((${a}) > 0 ? Number(Math.log10(${a}).toFixed(14).replace(/\\.?0+$/, '')): null)`,
  FIXED: ([num, decimals]) =>
    decimals
      ? `(function (){const [i, d] = (${num}).toFixed(${decimals}).split('.'); return i.replace(/\\B(?=(\\d{3})+(?!\\d))/g, ' ') + (d ? ('.' + String(d)) : '')})()`
      : `(function (){const [i, d] = String(${num}).split('.'); return i.replace(/\\B(?=(\\d{3})+(?!\\d))/g, ' ') + (d ? ('.' + String(d)) : '')})()`,
};
