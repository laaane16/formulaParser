import { numberFunctionsToJsMap } from '../../../../src/Parser/mappers/functions/numberFunctions/js';

describe('numberFunctionsToJsMap', () => {
  test('ABS', () => {
    expect(numberFunctionsToJsMap.ABS(['-5'])).toBe('Math.abs(-5)');
  });

  test('CEIL', () => {
    expect(numberFunctionsToJsMap.CEIL(['4.2'])).toBe(
      '(Math.ceil((4.2) * (10 ** (0))) / (10 ** (0)))',
    );
  });

  test('FLOOR', () => {
    expect(numberFunctionsToJsMap.FLOOR(['4.8'])).toBe(
      '(Math.floor((4.8) * (10 ** (0))) / (10 ** (0)))',
    );
  });

  test('EXP', () => {
    expect(numberFunctionsToJsMap.EXP(['2'])).toBe('Math.exp(2)');
  });

  test('MOD', () => {
    expect(numberFunctionsToJsMap.MOD(['10', '3'])).toBe('(10 % 3)');
  });

  test('POWER', () => {
    expect(numberFunctionsToJsMap.POWER(['2', '3'])).toBe('Math.pow(2, 3)');
  });

  test('ROUND', () => {
    expect(numberFunctionsToJsMap.ROUND(['4.6'])).toBe(
      '(Math.round((4.6) * (10 ** (0))) / (10 ** (0)))',
    );
  });

  test('SQRT', () => {
    expect(numberFunctionsToJsMap.SQRT(['9'])).toBe('Math.sqrt(9)');
  });

  test('RANDOM', () => {
    expect(numberFunctionsToJsMap.RANDOM([])).toBe('Math.random()');
  });

  test('SUM', () => {
    expect(numberFunctionsToJsMap.SUM(['2', '3'])).toBe('(2 + 3)');
  });

  test('AVERAGE', () => {
    expect(numberFunctionsToJsMap.AVERAGE(['2', '3'])).toBe('((2 + 3) / 2)');
  });

  test('MAX', () => {
    expect(numberFunctionsToJsMap.MAX(['2', '3'])).toBe('Math.max(2,3)');
  });

  test('MIN', () => {
    expect(numberFunctionsToJsMap.MIN(['2', '3'])).toBe('Math.min(2,3)');
  });

  test('SIN', () => {
    expect(numberFunctionsToJsMap.SIN(['2'])).toBe(
      "Number(Math.sin(2).toFixed(15).replace(/\\.?0+$/, ''))",
    );
  });

  test('COS', () => {
    expect(numberFunctionsToJsMap.COS(['2'])).toBe(
      "Number(Math.cos(2).toFixed(15).replace(/\\.?0+$/, ''))",
    );
  });

  test('TAN', () => {
    expect(numberFunctionsToJsMap.TAN(['2'])).toBe(
      "Number(Math.tan(2).toFixed(15).replace(/\\.?0+$/, ''))",
    );
  });

  test('COT', () => {
    expect(numberFunctionsToJsMap.COT(['2'])).toBe(
      "Number((1 / Math.tan(2)).toFixed(15).replace(/\\.?0+$/, ''))",
    );
  });

  test('ASIN', () => {
    expect(numberFunctionsToJsMap.ASIN(['2'])).toBe(
      "(function (){if ((2) >= - 1 && (2) <= 1) return Number(Math.asin(2).toFixed(15).replace(/\\.?0+$/, '')); return null})()",
    );
  });

  test('ACOS', () => {
    expect(numberFunctionsToJsMap.ACOS(['2'])).toBe(
      "(function (){if ((2) >= - 1 && (2) <= 1) return Number(Math.acos(2).toFixed(15).replace(/\\.?0+$/, '')); return null})()",
    );
  });

  test('ATAN', () => {
    expect(numberFunctionsToJsMap.ATAN(['2'])).toBe(
      "Number(Math.atan(2).toFixed(15).replace(/\\.?0+$/, ''))",
    );
  });

  test('ACOT', () => {
    expect(numberFunctionsToJsMap.ACOT(['2'])).toBe(
      "Number((Math.PI / 2 - Math.atan(2)).toFixed(15).replace(/\\.?0+$/, ''))",
    );
  });

  test('LN', () => {
    expect(numberFunctionsToJsMap.LN(['2'])).toBe(
      "((2) > 0 ? Number(Math.log(2).toFixed(14).replace(/\\.?0+$/, '')): null)",
    );
  });

  test('LOG', () => {
    expect(numberFunctionsToJsMap.LOG(['2', '3'])).toBe(
      "(((2) > 0 && (2) !== 1 && (3) > 0)  ? Number(Math.log(3) / Math.log(2).toFixed(14).replace(/\\.?0+$/, '')): null)",
    );
  });

  test('LOG10', () => {
    expect(numberFunctionsToJsMap.LOG10(['2'])).toBe(
      "((2) > 0 ? Number(Math.log10(2).toFixed(14).replace(/\\.?0+$/, '')): null)",
    );
  });
});
