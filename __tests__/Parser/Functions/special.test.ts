import { Parser } from '../../../src';

describe('', () => {
  test('funcs with null in args returns null like psql', () => {
    const parser = new Parser('ABS(1 / 0)');
    const js = parser.toJs(true);

    expect(parser.runJs(js, undefined)).toBe(null);
  });

  test('funcs can be written in different cases', () => {
    const parser = new Parser('ConCaT(10,"str")');
    const js = parser.toJs(true);

    expect(parser.runJs(js, undefined)).toBe('10str');
  });
});
