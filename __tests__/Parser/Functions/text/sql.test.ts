import { Parser } from '../../../../src';

describe('execute text funcs', () => {
  test('concat', () => {
    const parser = new Parser('CONCAT("HELLO", "_",  "WORLD")');
    expect(parser.toSql()).toBe(`CONCAT('HELLO','_','WORLD')`);
  });
  /**
   * return HELLO_WORLD in psql
   */

  test('trim leading', () => {
    const parser = new Parser('TRIM("leading", "abc" , "ababcd")');
    expect(parser.toSql()).toBe(`
      (CASE
        WHEN ('leading') = 'leading' THEN TRIM(LEADING ('abc') FROM ('ababcd'))
        WHEN ('leading') = 'trailing' THEN TRIM(TRAILING ('abc') FROM ('ababcd'))
        WHEN ('leading') = 'both' THEN TRIM(BOTH ('abc') FROM ('ababcd'))
        ELSE CAST(1 / 0 AS TEXT)
      END)
    `);
  });
  test('safe trim leading', () => {
    const parser = new Parser('TRIM("leading", "abc" , "ababcd")');
    expect(parser.toSql(true)).toBe(`
      (CASE
        WHEN ('leading') = 'leading' THEN TRIM(LEADING ('abc') FROM ('ababcd'))
        WHEN ('leading') = 'trailing' THEN TRIM(TRAILING ('abc') FROM ('ababcd'))
        WHEN ('leading') = 'both' THEN TRIM(BOTH ('abc') FROM ('ababcd'))
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
    expect(parser.toSql()).toBe(`POSITION(('lo') in ('Hello'))`);
  });
  /**
   * SEARCH("lo", "Hello") -> 4
   * SEARCH("a", "Hello") -> 0
   */

  test('replace', () => {
    const parser = new Parser('REPLACE("banana", "a", "o")');
    expect(parser.toSql()).toBe(`REPLACE('banana','a','o')`);
  });
  /**
   * REPLACE("banana", "a", "o") -> "bonono"
   * REPLACE("banana", "", "o") -> "banana"
   */

  test('lower', () => {
    const parser = new Parser('LOWER("BANANa")');
    expect(parser.toSql()).toBe("LOWER('BANANa')");
  });
  /**
   * return banana in psql
   */

  test('upper', () => {
    const parser = new Parser('UPPER("BaNANa")');
    expect(parser.toSql()).toBe("UPPER('BaNANa')");
  });
  /**
   * return BANANA in psql
   */

  test('repeat', () => {
    const parser = new Parser('REPEAT("x", 3)');
    expect(parser.toSql()).toBe("REPEAT('x',3)");
  });
  /**
   * REPEAT("x", 3) -> "xxx"
   * REPEAT("x", 0) -> ""
   * REPEAT("x", -3) -> ""
   */
  test('substring', () => {
    const parser = new Parser('SUBSTRING("abcdef", 2, 4)');
    expect(parser.toSql()).toBe(
      "SUBSTRING(('abcdef') from (CASE WHEN (2) > 0 THEN (2) ELSE 0 END) for (CASE WHEN (2) > 0 AND (2) > 0 THEN (4) ELSE 0 END))",
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
    expect(parser.toSql()).toBe(
      "LEFT(('str'), CASE WHEN (2) > 0 THEN (2) ELSE 0 END)",
    );
  });
  /**
   * LEFT('str', 2) -> 'st'
   * LEFT('str', -2) -> ''
   */

  test('right', () => {
    const parser = new Parser('RIGHT("str", 2)');
    expect(parser.toSql()).toBe(
      "RIGHT(('str'), CASE WHEN (2) > 0 THEN (2) ELSE 0 END)",
    );
  });
  /**
   * RIGHT('str', 2) -> 'tr'
   * LEFT('str', -2) -> ''
   */

  test('len', () => {
    const parser = new Parser('LEN("str")');
    expect(parser.toSql()).toBe("LENGTH('str')");
  });
  /**
   * return in psql 3
   */

  test('join with nums and strs', () => {
    const parser = new Parser('JOIN(",", "213", "test", 213)');
    expect(parser.toSql()).toBe("CONCAT_WS(',', '213','test',213)");
  });
  test('join with nums and strs and null', () => {
    const parser = new Parser('JOIN(",", "213", "test", 213, 1 / 0)');
    expect(parser.toSql(true)).toBe(
      "CONCAT_WS(',', '213','test',213,(CASE WHEN (0) != 0 THEN (1)::numeric / 0 ELSE NULL END))",
    );
  });
  /**
   * JOIN(',', 'str', 2) -> 'str,2'
   * JOIN(',', 'str', 2, 1/0) -> 'str,2'
   */

  test('to string', () => {
    const parser = new Parser('TO_STRING(1)');
    expect(parser.toSql()).toBe('(1)::text');
  });
  /**
   * TO_STRING(2) -> '2'
   * TO_STRING(1 / 0) -> NULL
   * TO_STRING('') -> ''
   */
});
