import { Parser } from '../../../src';

describe('execute literal', () => {
  test('empty string', () => {
    const parser = new Parser('""');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('');
  });

  test('string', () => {
    const parser = new Parser('"/qw.e`Ё{}"');
    const js = parser.toJs();
    expect(parser.runJs(js)).toBe('/qw.e`Ё{}');
  });
});
