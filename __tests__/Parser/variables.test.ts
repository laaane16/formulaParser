import { stringifyAstToJs } from '../helpers/stringifyAstToJs';
import { stringifyAstToSql } from '../helpers/stringifyAstToSql';
import { IVar } from '../../src/main';

const fields: Record<string, IVar> = {
  '1': {
    id: '1',
    type: 'number',
  },
  '2': {
    id: '2',
    type: 'number',
  },
};

describe('variables to sql', () => {
  test('return correct id', () => {
    const code = '{{1}}';
    const result = stringifyAstToSql(code, fields);

    expect(result).toBe(`$$VARIABLES['1']`);
  });
});

describe('variables errors', () => {
  test('return error if we write no valid variable', () => {
    const code = '{{Поле 1}}';

    expect(() => stringifyAstToJs(code, fields)).toThrow();
  });
});
