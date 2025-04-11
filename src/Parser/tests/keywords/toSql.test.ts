import { stringifyAstToSql } from '../helpers/stringifyAstToSql';

describe('keyword node to sql', () => {
  test('true', () => {
    const code = 'true';
    const result = stringifyAstToSql(code);

    expect(result).toBe('true');
  });

  test('false', () => {
    const code = 'false';
    const result = stringifyAstToSql(code);

    expect(result).toBe('false');
  });
});
