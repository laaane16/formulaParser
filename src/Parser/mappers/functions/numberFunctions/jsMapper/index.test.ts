import { numberFunctionsToJsMap } from '.';

describe('numberFunctionsToJsMap', () => {
  test('ABS', () => {
    expect(numberFunctionsToJsMap.ABS(['-5'])).toBe('Math.abs(-5)');
  });

  test('CEIL', () => {
    expect(numberFunctionsToJsMap.CEIL(['4.2'])).toBe('Math.ceil(4.2)');
  });

  test('FLOOR', () => {
    expect(numberFunctionsToJsMap.FLOOR(['4.8'])).toBe('Math.floor(4.8)');
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
    expect(numberFunctionsToJsMap.ROUND(['4.6'])).toBe('Math.round(4.6)');
  });

  test('SQRT', () => {
    expect(numberFunctionsToJsMap.SQRT(['9'])).toBe('Math.sqrt(9)');
  });

  test('RANDOM', () => {
    expect(numberFunctionsToJsMap.RANDOM([])).toBe('Math.random()');
  });
});
