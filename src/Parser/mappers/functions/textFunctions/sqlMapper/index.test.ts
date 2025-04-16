import { textFunctionsToSqlMap } from '.';

describe('textFunctionsToSqlMap', () => {
  test('CONCAT', () => {
    const result = textFunctionsToSqlMap.CONCAT(["'Hello'", "'World'"]);
    expect(result).toBe("CONCAT('Hello','World')");
  });

  test('TRIM both', () => {
    const result = textFunctionsToSqlMap.TRIM(["'both'", "'x'", "'xxabcxx'"]);
    expect(result).toBe("TRIM(both 'x' from 'xxabcxx')");
  });

  test('TRIM leading', () => {
    const result = textFunctionsToSqlMap.TRIM(["'leading'", "'x'", "'abcxx'"]);
    expect(result).toBe("TRIM(leading 'x' from 'abcxx')");
  });

  test('TRIM trailing', () => {
    const result = textFunctionsToSqlMap.TRIM(["'trailing'", "'x'", "'abcxx'"]);
    expect(result).toBe("TRIM(trailing 'x' from 'abcxx')");
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
});
