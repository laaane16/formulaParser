import { Parser } from '../../../src';

describe('literal node to js', () => {
  test('empty string', () => {
    const parser = new Parser('""');
    expect(parser.toSql()).toBe("''");
  });

  test('string', () => {
    const parser = new Parser('"/qw.e`Ё{{}}"');
    expect(parser.toSql()).toBe("'/qw.e`Ё{{}}'");
  });
});
