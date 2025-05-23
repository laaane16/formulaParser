import { Parser } from '../../../src';

describe('variables execute', () => {
  test('if true in condition', () => {
    const parser = new Parser('IF(1 > 2, "test", 1)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe(1);
  });
  test('if false in condition', () => {
    const parser = new Parser('IF(1 < 2, "test", 1)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('test');
  });
  test('if in funcs', () => {
    const parser = new Parser('CONCAT(IF(1 < 2, "test", 1), 12)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('test12');
  });
  test('if in funcs', () => {
    const parser = new Parser('CONCAT(IF(1 > 2, "test", 1), 12)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('112');
  });

  test('if in func with arg which can cast to needed type', () => {
    const parser = new Parser('MOD(IF(1 > 2, true, 4), 3)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe(1);
  });
  test('if in func with arg which can cast to needed type', () => {
    const parser = new Parser('MOD(IF(1 < 2, true, 5), 2)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe(1);
  });
  test('if with operator', () => {
    const parser = new Parser('IF(1 > 2, 1, "test") + IF(1 > 2, 2, "test2")');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('testtest2');
  });
});
