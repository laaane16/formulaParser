import { stringifyAstToSql } from '../helpers/stringifyAstToSql';

describe('unar operator node', () => {
  test('not', () => {
    const code = '!1';
    const result = stringifyAstToSql(code);

    expect(result).toBe('!1');
  });
});
