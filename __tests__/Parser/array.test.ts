import { Parser } from '../../src';

describe('arrays', () => {
  test('num arrays', () => {
    const parser = new Parser('[1,2,3,4]');
    expect(parser.runJs(parser.toJs(true))).toEqual([1, 2, 3, 4]);
  });
  test('num dates', () => {
    const parser = new Parser('[DATE(2012,12,12)]');
    expect(parser.runJs(parser.toJs(true))).toEqual(['2012-12-12 00:00:00+04']);
  });
  test('num bools', () => {
    const parser = new Parser('[true, false]');
    expect(parser.runJs(parser.toJs(true))).toEqual([true, false]);
  });
  test('num literals', () => {
    const parser = new Parser('["1","2"]');
    expect(parser.runJs(parser.toJs(true))).toEqual(['1', '2']);
  });
  test('if', () => {
    const parser = new Parser('IF(2 > 1, [1,2], [1])');
    expect(parser.runJs(parser.toJs(true))).toEqual([1, 2]);
  });
  test('if', () => {
    const parser = new Parser('INDEX(IF(2 > 1, [1,2], [1]), 0)');
    expect(parser.runJs(parser.toJs(true))).toBe(1);
  });
  test('if with different arrays', () => {
    const parser = new Parser('IF(2 > 1, [1,2,3], ["4","5","6"])');
    expect(() => parser.runJs(parser.toJs(true))).toThrow();
  });
});
