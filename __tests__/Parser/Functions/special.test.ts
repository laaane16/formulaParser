import { Parser } from '../../../src';

describe('', () => {
  test('funcs with null in args returns null like psql', () => {
    const parser = new Parser('ABS(1 / 0)');
    const js = parser.toJs(true);

    expect(parser.runJs(js, undefined)).toBe(null);
  });
});
