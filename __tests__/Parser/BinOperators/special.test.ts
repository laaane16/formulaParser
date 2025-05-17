import { stringifyAstToSql } from '../../helpers/stringifyAstToSql';
import { IVar } from '../../../src/main';

const fields: Record<string, IVar> = {
  'Поле 1': {
    id: '1',
    type: 'number',
  },
  'Поле 2': {
    id: '2',
    type: 'number',
  },
  'Поле 3': {
    id: '2',
    type: 'string',
  },
};

describe('bin operator node to sql', () => {
  test('plus can work with different types', () => {
    const code = `1 + "test"`;
    const result = stringifyAstToSql(code);

    expect(result).toBe(`CONCAT(1::text, 'test'::text)`);
  });
  test('equal with different types', () => {
    const code = '1 == "1"';
    const result = stringifyAstToSql(code);

    expect(result).toBe(`1::text = '1'::text`);
  });
  test('binary operators can work with if', () => {
    const code = 'IF(2 > 1, 1, 0) + IF(2 < 1, 1, 0)';
    const result = stringifyAstToSql(code);

    expect(result).toBe(
      'CASE WHEN 2 > 1 THEN 1 ELSE 0 END + CASE WHEN 2 < 1 THEN 1 ELSE 0 END',
    );
  });
  test('binary operators can work with valid vars, which has equal types', () => {
    const code = '{{Поле 2}} + {{Поле 2}}';
    const result = stringifyAstToSql(code, fields);

    expect(result).toBe(
      "COALESCE($$VARIABLES['Поле 2'], 0) + COALESCE($$VARIABLES['Поле 2'], 0)",
    );
  });
  test('bin operators precedences take into priorities', () => {
    expect(stringifyAstToSql(`1 * 1 + ""`)).toBe(
      `CONCAT(1 * 1::text, ''::text)`,
    );
  });
});

describe('bin operator node errors', () => {
  test('plus can`t work with vats which has different types', () => {
    const code = '{{Поле 3}} + {{Поле 2}}';

    expect(() => stringifyAstToSql(code, fields)).toThrow(
      'Unexpected type of data when + on the position 11',
    );
  });
  test('binary operators can`t work with IfStatementNode if it may returns different types', () => {
    const code = 'IF(2 > 1, "", 0) + 1';

    expect(() => stringifyAstToSql(code)).toThrow(
      'Unexpected type of data when + on the position 17',
    );
  });
});
