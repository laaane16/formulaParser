import { textFunctionsToSqlMap } from '../../../../src/Parser/mappers/functions/textFunctions/sql';

describe('textFunctionsToSqlMap', () => {
  test('CONCAT', () => {
    const result = textFunctionsToSqlMap.CONCAT(["'Hello'", "'World'"]);
    expect(result).toBe("CONCAT('Hello','World')");
  });

  test('TRIM both', () => {
    const result = textFunctionsToSqlMap.TRIM(["'both'", "'x'", "'xxabcxx'"]);
    expect(result).toBe(`
      CASE
        WHEN 'both' = 'leading' THEN TRIM(LEADING 'x' FROM 'xxabcxx')
        WHEN 'both' = 'trailing' THEN TRIM(TRAILING 'x' FROM 'xxabcxx')
        WHEN 'both' = 'both' THEN TRIM(BOTH 'x' FROM 'xxabcxx')
        ELSE 1 / 0
      END
    `);
  });

  test('TRIM leading', () => {
    const result = textFunctionsToSqlMap.TRIM(["'leading'", "'x'", "'abcxx'"]);
    expect(result).toBe(`
      CASE
        WHEN 'leading' = 'leading' THEN TRIM(LEADING 'x' FROM 'abcxx')
        WHEN 'leading' = 'trailing' THEN TRIM(TRAILING 'x' FROM 'abcxx')
        WHEN 'leading' = 'both' THEN TRIM(BOTH 'x' FROM 'abcxx')
        ELSE 1 / 0
      END
    `);
  });

  test('TRIM trailing', () => {
    const result = textFunctionsToSqlMap.TRIM(["'trailing'", "'x'", "'abcxx'"]);
    expect(result).toBe(`
      CASE
        WHEN 'trailing' = 'leading' THEN TRIM(LEADING 'x' FROM 'abcxx')
        WHEN 'trailing' = 'trailing' THEN TRIM(TRAILING 'x' FROM 'abcxx')
        WHEN 'trailing' = 'both' THEN TRIM(BOTH 'x' FROM 'abcxx')
        ELSE 1 / 0
      END
    `);
  });

  test('SEARCH', () => {
    const result = textFunctionsToSqlMap.SEARCH(["'abc'", "'abcde'"]);
    expect(result).toBe("POSITION('abc' in 'abcde')");
  });

  test('REPLACE', () => {
    const result = textFunctionsToSqlMap.REPLACE(["'abcabc'", "'a'", "'x'"]);
    expect(result).toBe("REPLACE('abcabc','a','x')");
  });

  test('LOWER', () => {
    const result = textFunctionsToSqlMap.LOWER(["'HELLO'"]);
    expect(result).toBe("LOWER('HELLO')");
  });

  test('UPPER', () => {
    const result = textFunctionsToSqlMap.UPPER(["'hello'"]);
    expect(result).toBe("UPPER('hello')");
  });

  test('REPEAT', () => {
    const result = textFunctionsToSqlMap.REPEAT(["'x'", '3']);
    expect(result).toBe("REPEAT('x',3)");
  });

  test('SUBSTRING', () => {
    const result = textFunctionsToSqlMap.SUBSTRING(["'abcdef'", '2', '3']);
    expect(result).toBe("SUBSTRING('abcdef' from 2 for 3)");
  });

  test('LEFT', () => {
    const result = textFunctionsToSqlMap.LEFT(["'abcdef'", '3']);
    expect(result).toBe("LEFT('abcdef', 3)");
  });

  test('RIGHT', () => {
    const result = textFunctionsToSqlMap.RIGHT(["'abcdef'", '2']);
    expect(result).toBe("RIGHT('abcdef', 2)");
  });

  test('LEN', () => {
    const result = textFunctionsToSqlMap.LEN(["'hello'"]);
    expect(result).toBe("LEN('hello')");
  });

  test('JOIN', () => {
    const result = textFunctionsToSqlMap.JOIN(["','", '1', "'1'"]);
    expect(result).toBe(`CONCAT_WS(',', 1,'1')`);
  });

  test('TOSTRING', () => {
    const result = textFunctionsToSqlMap.TO_STRING(['1']);
    expect(result).toBe('1::text');
  });
});
