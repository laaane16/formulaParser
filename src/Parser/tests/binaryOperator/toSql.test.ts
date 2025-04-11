import { stringifyAstToSql } from '../helpers/stringifyAstToSql';

describe('bin operator node', () => {
  test('plus', () => {
    const code = '1 + 1';
    const result = stringifyAstToSql(code);

    expect(result).toBe('1 + 1');
  });

  test('minus', () => {
    const code = '1 - 1';
    const result = stringifyAstToSql(code);

    expect(result).toBe('1 - 1');
  });

  test('multiply', () => {
    const code = '1 * 1';
    const result = stringifyAstToSql(code);

    expect(result).toBe('1 * 1');
  });

  test('division', () => {
    const code = '1 / 1';
    const result = stringifyAstToSql(code);

    expect(result).toBe('1 / 1');
  });

  test('remainder', () => {
    const code = '1 % 1';
    const result = stringifyAstToSql(code);

    expect(result).toBe('1 % 1');
  });

  test('power', () => {
    const code = '1 ^ 1';
    const result = stringifyAstToSql(code);

    expect(result).toBe('1 ^ 1');
  });

  test('equal', () => {
    const code = '1 == 1';
    const result = stringifyAstToSql(code);

    expect(result).toBe('1 = 1');
  });

  test('not equal', () => {
    const code = '1 != 1';
    const result = stringifyAstToSql(code);

    expect(result).toBe('1 != 1');
  });

  test('greater', () => {
    const code = '1 > 1';
    const result = stringifyAstToSql(code);

    expect(result).toBe('1 > 1');
  });

  test('greater or equal', () => {
    const code = '1 >= 1';
    const result = stringifyAstToSql(code);

    expect(result).toBe('1 >= 1');
  });

  test('less', () => {
    const code = '1 < 1';
    const result = stringifyAstToSql(code);

    expect(result).toBe('1 < 1');
  });

  test('less or equal', () => {
    const code = '1 <= 1';
    const result = stringifyAstToSql(code);

    expect(result).toBe('1 <= 1');
  });

  test('and', () => {
    const code = '1 && 1';
    const result = stringifyAstToSql(code);

    expect(result).toBe('1 AND 1');
  });

  test('or', () => {
    const code = '1 || 1';
    const result = stringifyAstToSql(code);

    expect(result).toBe('1 OR 1');
  });
});
