import { stringifyAstToSql } from '../helpers/stringifyAstToSql';

describe('literal node to sql', () => {
  test('empty string', () => {
    const code = '""';
    const result = stringifyAstToSql(code);

    expect(result).toBe("''");
  });

  test('string', () => {
    const code = '"/qw.e`Ё{{}}"';
    const result = stringifyAstToSql(code);

    expect(result).toBe("'/qw.e`Ё{{}}'");
  });
});
