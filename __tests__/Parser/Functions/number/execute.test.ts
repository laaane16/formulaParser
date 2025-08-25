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
  test('ceil with decimals', () => {
    const parser = new Parser('CEIL(4.12345, 2)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe(4.13);
  });
  test('floor', () => {
    const parser = new Parser('FLOOR(4.8)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe(4);
  });
  test('floor with decimals', () => {
    const parser = new Parser('FLOOR(4.12345, 2)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe(4.12);
  });
  test('exp', () => {
    const parser = new Parser('EXP(2)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe(7.3890560989);
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

  test('round mid with decimals', () => {
    const parser = new Parser('ROUND(4.12345, 2)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe(4.12);
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
  test('tonumber', () => {
    const parser = new Parser('TONUMBER("123")');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe(123);
  });
  test('tonumber with invalid string', () => {
    const parser = new Parser('TONUMBER("123asd")');
    const js = parser.toJs();

    expect(() => parser.runJs(js)).toThrow();
  });
  test('safe tonumber with invalid string', () => {
    const parser = new Parser('TONUMBER("123asd")');
    const js = parser.toJs(true);

    expect(parser.runJs(js)).toBe(null);
  });

  test('sin', () => {
    const parser = new Parser('SIN(PI() / 4)');
    const js = parser.toJs(true);

    expect(parser.runJs(js)).toBe(0.7071067812);
  });
  test('cos', () => {
    const parser = new Parser('COS(PI() / 6)');
    const js = parser.toJs(true);

    expect(parser.runJs(js)).toBe(0.8660254038);
  });
  test('tan', () => {
    const parser = new Parser('TAN(PI() / 4)');
    const js = parser.toJs(true);

    expect(parser.runJs(js)).toBe(1);
  });

  test('cot', () => {
    const parser = new Parser('COT(PI() / 4)');
    const js = parser.toJs(true);

    expect(parser.runJs(js)).toBe(1);
  });
  test('asin', () => {
    const parser = new Parser('ASIN(PI() / 4)');
    const js = parser.toJs(true);

    expect(parser.runJs(js)).toBe(0.9033391108);
  });
  test('acos', () => {
    const parser = new Parser('ACOS(PI() / 6)');
    const js = parser.toJs(true);

    expect(parser.runJs(js)).toBe(1.0197267437);
  });
  test('atan', () => {
    const parser = new Parser('ATAN(PI() / 4)');
    const js = parser.toJs(true);

    expect(parser.runJs(js)).toBe(0.66577375);
  });
  test('acot', () => {
    const parser = new Parser('ACOT(PI() / 4)');
    const js = parser.toJs(true);

    expect(parser.runJs(js)).toBe(0.9050225768);
  });
  test('LN', () => {
    const parser = new Parser('LN(5)');
    const js = parser.toJs(true);

    expect(parser.runJs(js)).toBe(1.6094379124);
  });
  test('LOG', () => {
    const parser = new Parser('LOG(3, 9)');
    const js = parser.toJs(true);

    expect(parser.runJs(js)).toBe(2.0);
  });
  test('LOG10', () => {
    const parser = new Parser('LOG10(100)');
    const js = parser.toJs(true);

    expect(parser.runJs(js)).toBe(2);
  });

  test('FIXED', () => {
    const parser = new Parser('FIXED(10000)');
    const js = parser.toJs(true);

    expect(parser.runJs(js)).toBe('10 000');
  });

  test('FIXED with 4 decimals', () => {
    const parser = new Parser('FIXED(10000, 4)');
    const js = parser.toJs(true);

    expect(parser.runJs(js)).toBe('10 000.0000');
  });

  test('FIXED with 4 decimals', () => {
    const parser = new Parser('FIXED(10000.12345, 4)');
    const js = parser.toJs(true);

    expect(parser.runJs(js)).toBe('10 000.1234');
  });

  test('FIXED with 4 decimals', () => {
    const parser = new Parser('FIXED(10000.12346, 4)');
    const js = parser.toJs(true);

    expect(parser.runJs(js)).toBe('10 000.1235');
  });
});
