import { stringifyAstToSql } from './helpers/stringifyAstToSql';
import { stringifyAstToJs } from './helpers/stringifyAstToJs';

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

describe('keyword node to js', () => {
  test('true', () => {
    const code = 'true';
    const result = stringifyAstToJs(code);

    expect(result).toBe('true');
  });

  test('false', () => {
    const code = 'false';
    const result = stringifyAstToJs(code);

    expect(result).toBe('false');
  });
});
