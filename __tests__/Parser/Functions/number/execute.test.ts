import { Parser } from '../../../../src';

describe('number funcs', () => {
  test('abs', () => {
    const parser = new Parser('ABS(-10)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe(10);
  });
  test('ceil', () => {
    const parser = new Parser('CEIL(10.123)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe(11);
  });
  test('floor', () => {
    const parser = new Parser('FLOOR(4.8)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe(4);
  });
  test('exp', () => {
    const parser = new Parser('EXP(2)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe(7.38905609893065);
  });
  test('mod', () => {
    const parser = new Parser('MOD(10, 3)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe(1);
  });
  test('mod with negative', () => {
    const parser = new Parser('MOD(-10, 3)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe(-1);
  });
  test('mod with zero', () => {
    const parser = new Parser('MOD(10, 0)');
    const js = parser.toJs();

    expect(() => parser.runJs(js)).toThrow();
  });
  test('mod safe', () => {
    const parser = new Parser('MOD(10, 3)');
    const js = parser.toJs(true);

    expect(parser.runJs(js)).toBe(1);
  });
  test('mod safe with zero', () => {
    const parser = new Parser('MOD(10, 0)');
    const js = parser.toJs(true);

    expect(parser.runJs(js)).toBe(null);
  });
  test('power', () => {
    const parser = new Parser('POWER(2, 3)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe(8);
  });
  test('round low', () => {
    const parser = new Parser('ROUND(4.4)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe(4);
  });
  test('round high', () => {
    const parser = new Parser('ROUND(4.6)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe(5);
  });
  test('round mid', () => {
    const parser = new Parser('ROUND(4.5)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe(5);
  });
  test('sqrt', () => {
    const parser = new Parser('SQRT(25)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe(5);
  });
  test('sqrt with negative', () => {
    const parser = new Parser('SQRT(-1)');
    const js = parser.toJs();

    expect(() => parser.runJs(js)).toThrow();
  });
  test('sqrt safe', () => {
    const parser = new Parser('SQRT(25)');
    const js = parser.toJs(true);

    expect(parser.runJs(js)).toBe(5);
  });
  test('sqrt with zero', () => {
    const parser = new Parser('SQRT(0)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe(0);
  });
  test('sqrt safe with negative', () => {
    const parser = new Parser('SQRT(-1)');
    const js = parser.toJs(true);

    expect(parser.runJs(js)).toBe(null);
  });
  test('sqrt safe with zero', () => {
    const parser = new Parser('SQRT(0)');
    const js = parser.toJs(true);

    expect(parser.runJs(js)).toBe(0);
  });
  test('random', () => {
    const parser = new Parser('RANDOM()');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBeLessThan(1);
  });
  test('sum', () => {
    const parser = new Parser('SUM(1,2,3,4,5)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe(15);
  });
  test('average', () => {
    const parser = new Parser('AVERAGE(1,2,3,4,5)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe(3);
  });
  test('max', () => {
    const parser = new Parser('MAX(1,2,3,4,5)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe(5);
  });
  test('min', () => {
    const parser = new Parser('MIN(1,2,3,4,5)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe(1);
  });
  test('to_number', () => {
    const parser = new Parser('TO_NUMBER("123")');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe(123);
  });
  test('to_number with invalid string', () => {
    const parser = new Parser('TO_NUMBER("123asd")');
    const js = parser.toJs();

    expect(() => parser.runJs(js)).toThrow();
  });
  test('safe to_number', () => {
    const parser = new Parser('TO_NUMBER("123")');
    const js = parser.toJs(true);

    expect(parser.runJs(js)).toBe(123);
  });
  test('safe to_number with invalid string', () => {
    const parser = new Parser('TO_NUMBER("123asd")');
    const js = parser.toJs(true);

    expect(parser.runJs(js)).toBe(null);
  });
});
