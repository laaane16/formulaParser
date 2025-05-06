import { stringifyAstToJs } from '../helpers/stringifyAstToJs';
import { stringifyAstToSql } from '../helpers/stringifyAstToSql';

describe('null to sql', () => {
  test('null', () => {
    const code = 'null';
    const result = stringifyAstToSql(code);

    expect(result).toBe('null');
  });
});

describe('null to js', () => {
  test('null', () => {
    const code = 'null';
    const result = stringifyAstToJs(code);

    expect(result).toBe('null');
  });
});
