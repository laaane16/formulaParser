import { IField } from '../..';
import { stringifyAstToJs } from './helpers/stringifyAstToJs';
import { stringifyAstToSql } from './helpers/stringifyAstToSql';

describe('variables to sql', () => {
  test('return correct id', () => {
    const code = '{{Поле 1}}';
    const fields: IField[] = [{ id: '1000', title: 'Поле 1', type: 'text' }];
    const result = stringifyAstToSql(code, fields);

    expect(result).toBe('$1000');
  });
});

describe('variables to js', () => {
  test('return correct id', () => {
    const code = '{{Поле 1}}';
    const fields: IField[] = [{ id: '1000', title: 'Поле 1', type: 'text' }];
    const result = stringifyAstToJs(code, fields);

    expect(result).toBe('VARIABLES.$1000');
  });
});

describe('variables errors', () => {
  test('return error if we write no valid variable', () => {
    const code = '{{Поле 1}}';
    const fields: IField[] = [{ id: '1000', title: 'Поле 2', type: 'text' }];
    try {
      const result = stringifyAstToJs(code, fields);
    } catch (e) {
      if (e instanceof Error) {
        expect(e.message).toBe(
          'Недопустимая переменная {{Поле 1}} на позиции 0',
        );
      } else {
        throw new Error('Непредвиденная ошибка');
      }
    }
  });
});
