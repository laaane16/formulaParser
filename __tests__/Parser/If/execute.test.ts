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
});
