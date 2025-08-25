import { stringifyAstToSql } from '../../helpers/stringifyAstToSql';
import { IVar } from '../../../src/types';

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

const values = {
  'Поле 2': 150,
  'Поле 3': 'str',
};

describe('bin operator node to sql', () => {
  test('plus can work with different types', () => {
    const code = `1 + "test"`;
    const result = stringifyAstToSql(code);

    expect(result).toBe(`CONCAT((1)::text, ('test')::text)`);
  });
  test('equal with different types', () => {
    const code = '1 == "1"';
    const result = stringifyAstToSql(code);

    expect(result).toBe(`(1)::text = ('1')::text`);
  });
  test('binary operators can work with if', () => {
    const code = 'IF(2 > 1, 1, 0) + IF(2 < 1, 1, 0)';
    const result = stringifyAstToSql(code);

    expect(result).toBe(
      'ROUND((CASE WHEN (2 > 1) THEN (1)::text ELSE (0)::text END)::NUMERIC + (CASE WHEN (2 < 1) THEN (1)::text ELSE (0)::text END)::NUMERIC, 10)::NUMERIC',
    );
  });
  test('binary operators can work with valid vars, which has equal types', () => {
    const code = '{Поле 2} + {Поле 2}';
    const result = stringifyAstToSql(code, fields, values);

    expect(result).toBe(
      'ROUND(COALESCE(150, 0) + COALESCE(150, 0), 10)::NUMERIC',
    );
  });
  test('bin operators precedences take into priorities', () => {
    expect(stringifyAstToSql(`1 * 1 + ""`)).toBe(
      `CONCAT((ROUND(1 * 1, 10)::NUMERIC)::text, ('')::text)`,
    );
  });
  test('binary operators can`t work with IfStatementNode if it may returns different types', () => {
    const code = 'IF(2 > 1, "", 0) + 1';

    expect(stringifyAstToSql(code)).toBe(
      "CONCAT(((CASE WHEN (2 > 1) THEN ('')::text ELSE (0)::text END)::TEXT)::text, (1)::text)",
    );
  });
  test('binary operators can`t work with IfStatementNode if it may returns different types', () => {
    const code = 'IF(2 > 1, 1, IF(1 > 2, 1, "")) + 1';

    expect(stringifyAstToSql(code)).toBe(
      "CONCAT(((CASE WHEN (2 > 1) THEN (1)::text ELSE ((CASE WHEN (1 > 2) THEN (1)::text ELSE ('')::text END)::TEXT)::text END)::TEXT)::text, (1)::text)",
    );
  });
});

describe('bin operator node errors', () => {
  test('plus can`t work with vats which has different types', () => {
    const code = '{Поле 3} + {Поле 2}';

    expect(() => stringifyAstToSql(code, fields, values)).toThrow(
      'Unexpected type of data when + on the position 9',
    );
  });
});
