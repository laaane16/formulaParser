import { IField } from '../../src/main';
import { stringifyAstToJs } from '../helpers/stringifyAstToJs';
import { stringifyAstToSql } from '../helpers/stringifyAstToSql';

// FIXME: TEMPEST COMMENT
// describe('variables to sql', () => {
//   test('return correct id', () => {
//     const code = '{{1000}}';
//     const fields: IField[] = [{ id: '1000', name: 'Поле 1', type: 'text' }];
//     const result = stringifyAstToSql(code, fields);

//     expect(result).toBe(`VARIABLES['1000']`);
//   });
// });

describe('variables errors', () => {
  test('return error if we write no valid variable', () => {
    const code = '{{Поле 1}}';
    const fields: IField[] = [{ id: '1000', name: 'Поле 2', type: 'text' }];

    expect(() => stringifyAstToJs(code, fields)).toThrow(
      'Invalid variable {{Поле 1}} on the position 0',
    );
  });
});
