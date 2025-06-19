import { Parser } from '../../../src';

describe('literal node to js', () => {
  test('empty string', () => {
    const parser = new Parser('""');
    expect(parser.toSqlWithVariables()).toBe("''");
  });

  test('string', () => {
    const parser = new Parser('"/qw.e`Ё{}"');
    expect(parser.toSqlWithVariables()).toBe("'/qw.e`Ё{}'");
  });
});
