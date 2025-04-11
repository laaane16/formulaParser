import { stringifyAstToJs } from './helpers/stringifyAstToJs';
import { stringifyAstToSql } from './helpers/stringifyAstToSql';

describe('unar operator node to sql', () => {
  test('not', () => {
    const code = '!1';
    const result = stringifyAstToSql(code);

    expect(result).toBe('NOT 1');
  });
});

describe('unar operator node to js', () => {
  test('not', () => {
    const code = '!1';
    const result = stringifyAstToJs(code);

    expect(result).toBe('! 1');
  });
});
