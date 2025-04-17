import { stringifyAstToJs } from './helpers/stringifyAstToJs';
import { stringifyAstToSql } from './helpers/stringifyAstToSql';

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

describe('literal node to js', () => {
  test('empty string', () => {
    const code = '""';
    const result = stringifyAstToJs(code);

    expect(result).toBe('""');
  });

  test('string', () => {
    const code = '"/qw.e`Ё{{}}"';
    const result = stringifyAstToJs(code);

    expect(result).toBe('"/qw.e`Ё{{}}"');
  });
});
