import { IField } from '../../src/main';
import { stringifyAstToJs } from '../helpers/stringifyAstToJs';
import { stringifyAstToSql } from '../helpers/stringifyAstToSql';

describe('variables to sql', () => {
  test('return correct id', () => {
    const code = '{{Поле 1}}';
    const fields: IField[] = [{ id: '1000', name: 'Поле 1', type: 'text' }];
    const result = stringifyAstToSql(code, fields);

    expect(result).toBe(`VARIABLES['1000']`);
  });
});

describe('variables to js', () => {
  test('return correct id', () => {
    const code = '{{Поле 1}}';
    const fields: IField[] = [{ id: '1000', name: 'Поле 1', type: 'text' }];
    const result = stringifyAstToJs(code, fields);

    expect(result).toBe(`VARIABLES['1000']`);
  });
});

describe('variables errors', () => {
  test('return error if we write no valid variable', () => {
    const code = '{{Поле 1}}';
    const fields: IField[] = [{ id: '1000', name: 'Поле 2', type: 'text' }];

    expect(() => stringifyAstToJs(code, fields)).toThrow(
      'Недопустимая переменная {{Поле 1}} на позиции 0',
    );
  });
});
