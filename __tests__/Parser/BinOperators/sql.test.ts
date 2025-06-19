import { Parser } from '../../../src';

describe('Binary operators to sql', () => {
  const variables = {
    field1: {
      id: '1',
      name: 'field1',
      type: 'number',
    },
    field2: {
      id: '1',
      name: 'field2',
      type: 'text',
    },
  };
  const values = {
    field1: null,
    field2: null,
  };

  test('plus correct with nums', () => {
    const parser = new Parser('1 + 1');
    expect(parser.toSqlWithVariables()).toBe('1 + 1');
  });
  test('plus correct with strs', () => {
    const parser = new Parser(`'1' + "1"`);
    expect(parser.toSqlWithVariables()).toBe(`CONCAT('1', '1')`); // '11' in psql
  });
  test('plus correct with str and num', () => {
    const parser = new Parser(`1 + "1"`);
    expect(parser.toSqlWithVariables()).toBe(`CONCAT((1)::text, ('1')::text)`); // '11' in psql
  });
  test('plus with null and num', () => {
    const parser = new Parser('1 + {field1}', variables);
    const sqlFormula = parser.toSqlWithVariables(false, values);

    expect(sqlFormula).toBe(
      '1 + COALESCE(null, 0)', // 1 in psql
    );
  });
  test('plus with null and str', () => {
    const parser = new Parser('"" + {field2}', variables);
    const sqlFormula = parser.toSqlWithVariables(false, values);

    expect(sqlFormula).toBe(
      `CONCAT('', COALESCE(null, ''))`, // '' in psql
    );
  });
  test('plus with null and null', () => {
    const parser = new Parser('{field1} + {field2}', variables);
    const sqlFormula = parser.toSqlWithVariables(false, values);

    expect(sqlFormula).toBe(
      `CONCAT((COALESCE(null, 0))::text, (COALESCE(null, ''))::text)`, // '0' in psql
    );
  });
  test('plus with null', () => {
    const parser = new Parser('1 + 1 / 0', variables);
    const sqlFormula = parser.toSqlWithVariables(true);

    expect(sqlFormula).toBe(
      '1 + (CASE WHEN (0) != 0 THEN (1)::numeric / 0 ELSE NULL END)',
    ); // null in psql
  });
  test('plus with str and null', () => {
    const parser = new Parser('"test" + 1 / 0', variables);
    const sqlFormula = parser.toSqlWithVariables(true);

    expect(sqlFormula).toBe(
      `CONCAT(('test')::text, ((CASE WHEN (0) != 0 THEN (1)::numeric / 0 ELSE NULL END))::text)`,
    ); // "test" in psql
  });

  // CONCATENATION
  test('concatenation correct with nums', () => {
    const parser = new Parser('1 & 1');
    expect(parser.toSqlWithVariables()).toBe('CONCAT((1)::text, (1)::text)');
  });
  /**
   * In psql results are:
   * 1 & 1 -> '11'
   * "1" & "1" -> '11'
   * "1" & 1 -> '11'
   *  1 & {field} -> '10', field - number type and null value
   *  "" & {field} -> '', field - text type and null value
   *  {field1} & {field2} -> '0', field1 - number type, field2 - text type and all values = null
   *  1 & 1 / 0 -> '1'
   */

  // MINUS
  test('minus', () => {
    const parser = new Parser('1 - 1');
    expect(parser.toSqlWithVariables()).toBe('1 - 1');
  });
  /**
   * In psql results are:
   * 1 - 1 -> 0
   * 1 - {field} -> 1, field = null
   * 1 - 1 / 0 -> null
   */

  // MULTIPLY
  test('multiply', () => {
    const parser = new Parser('1 * 3');
    expect(parser.toSqlWithVariables()).toBe('1 * 3');
  });
  /**
   * In psql results are:
   * 1 * 3 -> 3
   * 1 * {field} -> 0, field = null
   * 1 - 1 / 0 -> null
   */

  // DIVISION
  test('division', () => {
    const parser = new Parser('10 / 3');
    expect(parser.toSqlWithVariables(true)).toBe(
      '(CASE WHEN (3) != 0 THEN (10)::numeric / 3 ELSE NULL END)',
    );
  });
  /**
   * In psql results are:
   * 10 / 2 -> 5
   * 10 / {field} -> null, field = null
   * 10 / 0  -> null
   * 10 / 3 -> 3
   */

  // REMAINDER
  test('remainder', () => {
    const parser = new Parser('10 % 3');
    expect(parser.toSqlWithVariables(true)).toBe(
      '(CASE WHEN (3) != 0 THEN 10 % 3 ELSE NULL END)',
    );
  });
  /**
   * In psql results are:
   * 10 % 2 -> 5
   * -10 % 3 -> -1
   * 10 / {field} -> null, field = null
   * 10 / 0  -> null
   */

  // POWER
  test('power', () => {
    const parser = new Parser('10 ^ 3');
    expect(parser.toSqlWithVariables(true)).toBe('(10 ^ 3)');
  });
  /**
   * In psql results are:
   * 3 ^ 3 -> 27
   * 3 ^ -3 -> 1 / 27
   * 3 ^ (1 / 0)  -> null, field = null
   */

  // EQUAL
  test('equal', () => {
    const parser = new Parser('10 == 3');
    expect(parser.toSqlWithVariables(true)).toBe('10 = 3');
  });
  /**
   * In psql results are:
   * 10 == 10 -> true
   * 'asd' == 'a' -> false
   * 'asd' == 10 -> false
   * '10' == 10 -> true
   * 0 == 1 / 0 -> null
   */

  // NOT EQUAL
  test('not equal', () => {
    const parser = new Parser('10 != 3');
    expect(parser.toSqlWithVariables(true)).toBe('10 != 3');
  });
  /**
   * In psql results are:
   * 10 != 10 -> false
   * 'asd' != 'a' -> true
   * 'asd' != 10 -> true
   * '10' != 10 -> false
   * 0 != 1 / 0 -> null
   */

  // GREATER
  test('greater', () => {
    const parser = new Parser('10 > 3');
    expect(parser.toSqlWithVariables(true)).toBe('10 > 3');
  });
  /**
   * In psql results are:
   * 10 > 10 -> false
   * 'asd' > '10' -> true
   * 'asd' > 10 -> true
   * '10' > 10 -> false
   * 0 > 1 / 0 -> null
   */

  // GREATER OR EQUAL
  test('not equal', () => {
    const parser = new Parser('10 >= 3');
    expect(parser.toSqlWithVariables(true)).toBe('10 >= 3');
  });
  /**
   * In psql results are:
   * 10 >= 10 -> true
   * 'asd' >= '10' -> true
   * 'asd' >= 10 -> true
   * '10' >= 10 -> true
   * 0 >= 1 / 0 -> null
   */

  // LESS
  test('less', () => {
    const parser = new Parser('10 < 3');
    expect(parser.toSqlWithVariables(true)).toBe('10 < 3');
  });
  /**
   * In psql results are:
   * 10 < 10 -> false
   * 'asd' < '10' -> false
   * 'asd' < 10 -> false
   * '10' < 10 -> false
   * 0 < 1 / 0 -> null
   */

  // LESS OR EQUAL
  test('less or equal', () => {
    const parser = new Parser('10 <= 3');
    expect(parser.toSqlWithVariables(true)).toBe('10 <= 3');
  });
  /**
   * In psql results are:
   * 10 <= 10 -> true
   * 'asd' <= '10' -> false
   * 'asd' <= 10 -> false
   * '10' <= 10 -> true
   * 0 <= 1 / 0 -> null
   */

  // AND
  test('and', () => {
    const parser = new Parser('1 > 0 && 1 > 0');
    expect(parser.toSqlWithVariables(true)).toBe('1 > 0 AND 1 > 0');
  });
  /**
   * In psql results are:
   * 1 > 0 && 1 > 0 -> true
   * 1 > 0 && 1 > 1 / 0 -> null
   */

  // OR
  test('or', () => {
    const parser = new Parser('1 > 1 || 1 > 0');
    expect(parser.toSqlWithVariables(true)).toBe('1 > 1 OR 1 > 0');
  });
  /**
   * In psql results are:
   * 1 > 1 || 1 > 0 -> true
   * 1 > 0 && 1 > 1 / 0 -> null
   */
});
