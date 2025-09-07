import { Parser } from '../../../../src';

describe('execute text funcs', () => {
  test('concat', () => {
    const parser = new Parser('CONCAT("HELLO", "_",  "WORLD")');
    expect(parser.toSqlWithVariables()).toBe(`CONCAT('HELLO','_','WORLD')`);
  });
  /**
   * return HELLO_WORLD in psql
   */

  test('trim leading', () => {
    const parser = new Parser('TRIM("leading", "abc" , "ababcd")');
    expect(parser.toSqlWithVariables()).toBe(`
      (CASE ('leading')
        WHEN 'leading' THEN TRIM(LEADING ('abc') FROM ('ababcd'))
        WHEN 'trailing' THEN TRIM(TRAILING ('abc') FROM ('ababcd'))
        WHEN 'both' THEN TRIM(BOTH ('abc') FROM ('ababcd'))
        ELSE CAST(1 / 0 AS TEXT)
      END)
    `);
  });
  test('safe trim leading', () => {
    const parser = new Parser('TRIM("leading", "abc" , "ababcd")');
    expect(parser.toSqlWithVariables(true)).toBe(`
      (CASE ('leading')
        WHEN 'leading' THEN TRIM(LEADING ('abc') FROM ('ababcd'))
        WHEN 'trailing' THEN TRIM(TRAILING ('abc') FROM ('ababcd'))
        WHEN 'both' THEN TRIM(BOTH ('abc') FROM ('ababcd'))
        ELSE NULL
      END)
    `);
  });
  /**
   * TRIM("leading", "abc" , "ababcd") -> 'd'
   * TRIM("trailing", "abc" , "qnabc") -> 'qn'
   * TRIM("both", "abc" , "abcdabc") -> 'd'
   * TRIM("asdasdas", "abc" , "abcdabc") -> ERROR
   * safe mod: TRIM("leading", "abc" , "ababcd") -> 'd'
   * safe mod: TRIM("trailing", "abc" , "qnabc") -> 'qn'
   * safe mod: TRIM("both", "abc" , "abcdabc") -> 'd'
   * safe mod: TRIM("asdasdas", "abc" , "abcdabc") -> NULL
   */

  test('search', () => {
    const parser = new Parser('SEARCH("lo", "Hello")');
    expect(parser.toSqlWithVariables()).toBe(
      `(POSITION(('Hello') in ('lo')) - 1)`,
    );
  });
  /**
   * SEARCH("lo", "Hello") -> 4
   * SEARCH("a", "Hello") -> 0
   */

  test('replace', () => {
    const parser = new Parser('REPLACE("banana", "a", "o")');
    expect(parser.toSqlWithVariables()).toBe(`REPLACE('banana','a','o')`);
  });
  /**
   * REPLACE("banana", "a", "o") -> "bonono"
   * REPLACE("banana", "", "o") -> "banana"
   */

  test('lower', () => {
    const parser = new Parser('LOWER("BANANa")');
    expect(parser.toSqlWithVariables()).toBe("LOWER('BANANa')");
  });
  /**
   * return banana in psql
   */

  test('upper', () => {
    const parser = new Parser('UPPER("BaNANa")');
    expect(parser.toSqlWithVariables()).toBe("UPPER('BaNANa')");
  });
  /**
   * return BANANA in psql
   */

  test('repeat', () => {
    const parser = new Parser('REPEAT("x", 3)');
    expect(parser.toSqlWithVariables()).toBe("REPEAT('x',3)");
  });
  /**
   * REPEAT("x", 3) -> "xxx"
   * REPEAT("x", 0) -> ""
   * REPEAT("x", -3) -> ""
   */
  test('substring', () => {
    const parser = new Parser('SUBSTRING("abcdef", 2, 4)');
    expect(parser.toSqlWithVariables()).toBe(
      "SUBSTRING(('abcdef') from (CASE WHEN (2) >= 0 THEN (2) + 1 ELSE 1 END) for (CASE WHEN (2) >= 0 AND (4) > 0 THEN (4) ELSE 0 END))",
    );
  });
  /**
   * SUBSTRING("abcdef", 2, 4) -> 'bcde'
   * SUBSTRING("str", -1, 3) -> ''
   * SUBSTRING("str", 2, -2) -> ''
   * SUBSTRING("str", -2, -2) -> ''
   */

  test('left', () => {
    const parser = new Parser('LEFT("str", 2)');
    expect(parser.toSqlWithVariables()).toBe(
      "LEFT(('str'), CASE WHEN (2) > 0 THEN (2) ELSE 0 END)",
    );
  });
  /**
   * LEFT('str', 2) -> 'st'
   * LEFT('str', -2) -> ''
   */

  test('right', () => {
    const parser = new Parser('RIGHT("str", 2)');
    expect(parser.toSqlWithVariables()).toBe(
      "RIGHT(('str'), CASE WHEN (2) > 0 THEN (2) ELSE 0 END)",
    );
  });
  /**
   * RIGHT('str', 2) -> 'tr'
   * LEFT('str', -2) -> ''
   */

  test('len', () => {
    const parser = new Parser('LEN("str")');
    expect(parser.toSqlWithVariables()).toBe("LENGTH('str')");
  });
  /**
   * return in psql 3
   */

  test('join with strs array', () => {
    const parser = new Parser('JOIN(["213", "test", "213"], ",")');
    expect(parser.toSqlWithVariables()).toBe(
      "ARRAY_TO_STRING(ARRAY['213','test','213'], ',')",
    );
  });
  test('join with nums array', () => {
    const parser = new Parser('JOIN([1, 2, 3], ",")');
    expect(parser.toSqlWithVariables()).toBe(
      "ARRAY_TO_STRING(ARRAY[1,2,3], ',')",
    );
  });
  test('join with nums array, null should be ignored', () => {
    const parser = new Parser('JOIN([1, 2, 3, 1 / 0], ",")');
    expect(parser.toSqlWithVariables(true)).toBe(
      "ARRAY_TO_STRING(ARRAY[1,2,3,(CASE WHEN (0) != 0 THEN ROUND((1)::numeric / 0, 10)::NUMERIC ELSE NULL END)], ',')",
    );
  });

  test('to string', () => {
    const parser = new Parser('TOSTRING(1)');
    expect(parser.toSqlWithVariables()).toBe('(1)::text');
  });
  /**
   * TOSTRING(2) -> '2'
   * TOSTRING(1 / 0) -> NULL
   * TOSTRING('') -> ''
   */
});
