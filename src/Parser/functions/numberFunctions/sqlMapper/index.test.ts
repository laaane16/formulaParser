import { numberFunctionsToSqlMap } from '.';

describe('numberFunctionsToSqlMap', () => {
  test('ABS', () => {
    expect(numberFunctionsToSqlMap.ABS(['-5'])).toBe('ABS(-5)');
  });

  test('CEIL', () => {
    expect(numberFunctionsToSqlMap.CEIL(['4.2'])).toBe('CEIL(4.2)');
  });

  test('FLOOR', () => {
    expect(numberFunctionsToSqlMap.FLOOR(['4.8'])).toBe('FLOOR(4.8)');
  });

  test('EXP', () => {
    expect(numberFunctionsToSqlMap.EXP(['2'])).toBe('EXP(2)');
  });

  test('MOD', () => {
    expect(numberFunctionsToSqlMap.MOD(['10', '3'])).toBe('MOD(10, 3)');
  });

  test('POWER', () => {
    expect(numberFunctionsToSqlMap.POWER(['2', '3'])).toBe('POWER(2, 3)');
  });

  test('ROUND', () => {
    expect(numberFunctionsToSqlMap.ROUND(['4.6'])).toBe('ROUND(4.6)');
  });

  test('SQRT', () => {
    expect(numberFunctionsToSqlMap.SQRT(['9'])).toBe('SQRT(9)');
  });

  test('RANDOM', () => {
    expect(numberFunctionsToSqlMap.RANDOM([])).toBe('RANDOM()');
  });
});
