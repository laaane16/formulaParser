import { stringifyAstToSql } from './helpers/stringifyAstToSql';

describe('number node to sql', () => {
  test('natural number', () => {
    const code = '10001';
    const result = stringifyAstToSql(code);

    expect(result).toBe('10001');
  });

  test('float number', () => {
    const code = '1.123';
    const result = stringifyAstToSql(code);

    expect(result).toBe('1.123');
  });
});
