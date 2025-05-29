import { Parser } from '../../../../src';

describe('number funcs', () => {
  test('abs', () => {
    const parser = new Parser('ABS(-10)');
    expect(parser.toSql()).toBe('ABS(- 10)');
  });
  /**
   * return 10 in psql
   */

  test('ceil', () => {
    const parser = new Parser('CEIL(10.123)');
    expect(parser.toSql()).toBe('CEIL(10.123)');
  });
  /**
   * return 11 in psql
   */

  test('floor', () => {
    const parser = new Parser('FLOOR(4.8)');
    expect(parser.toSql()).toBe('FLOOR(4.8)');
  });
  /**
   * return 4 in psql
   */

  test('exp', () => {
    const parser = new Parser('EXP(2)');
    expect(parser.toSql()).toBe('EXP(2)');
  });
  /**
   * return 7.38905609893065 in psql
   */

  test('mod', () => {
    const parser = new Parser('MOD(10, 3)');
    expect(parser.toSql()).toBe('MOD(10, 3)');
  });
  test('mod safe', () => {
    const parser = new Parser('MOD(10, 3)');
    expect(parser.toSql(true)).toBe(
      `(CASE WHEN (3) != 0 THEN MOD(10, 3) ELSE NULL END)`,
    );
  });
  /**
   * MOD(10, 3) -> 1
   * MOD(-10, 3) -> -1
   * MOD(10, 0) -> ERROR
   * safe mod: MOD(10, 0) -> NULL
   */

  test('power', () => {
    const parser = new Parser('POWER(2, 3)');
    expect(parser.toSql()).toBe('POWER(2, 3)');
  });
  /**
   * return 8 in psql
   */

  test('round', () => {
    const parser = new Parser('ROUND(4.4)');
    expect(parser.toSql()).toBe('ROUND(4.4)');
  });
  /**
   * ROUND(4.4) -> 4
   * ROUND(4.5) -> 5
   * ROUND(4.6) -> 5
   */

  test('sqrt', () => {
    const parser = new Parser('SQRT(25)');
    expect(parser.toSql()).toBe('SQRT(25)');
  });
  test('sqrt safe', () => {
    const parser = new Parser('SQRT(25)');
    expect(parser.toSql(true)).toBe(
      '(CASE WHEN 25 >= 0 THEN SQRT(25) ELSE NULL END)',
    );
  });
  /**
   * SQRT(25) -> 5
   * SQRT(-1) -> ERROR
   * SQRT(0) -> 0
   * safe mod: SQRT(-1) -> NULL
   */

  test('random', () => {
    const parser = new Parser('RANDOM()');
    expect(parser.toSql()).toBe('RANDOM()');
  });
  /**
   * return random number; 0 <= number < 1
   */

  test('sum', () => {
    const parser = new Parser('SUM(1,2,3,4,5)');
    expect(parser.toSql()).toBe('((1) + (2) + (3) + (4) + (5))');
  });
  /**
   * return 15 in psql
   */

  test('average', () => {
    const parser = new Parser('AVERAGE(1,2,3,4,5)');
    expect(parser.toSql()).toBe('(((1) + (2) + (3) + (4) + (5)) / (5))');
  });
  /**
   * return 3 in psql
   */

  test('max', () => {
    const parser = new Parser('MAX(1,2,3,4)');
    expect(parser.toSql()).toBe('GREATEST(1,2,3,4)');
  });
  /**
   * return 4 in psql
   */

  test('min', () => {
    const parser = new Parser('MIN(1,2,3,4,5)');
    expect(parser.toSql()).toBe('LEAST(1,2,3,4,5)');
  });
  /**
   * return 1 in psql
   */

  test('to_number', () => {
    const parser = new Parser('TO_NUMBER("123")');
    expect(parser.toSql()).toBe("('123')::numeric");
  });
  test('safe to_number', () => {
    const parser = new Parser('TO_NUMBER("123")');
    expect(parser.toSql(true)).toBe(
      `(CASE WHEN ('123')::text ~ '^[-]*\\d+(\\.\\d+)?$' THEN ('123')::text::numeric ELSE NULL END)`,
    );
  });
  /**
   * TO_NUMBER("123") -> 123
   * TO_NUMBER("123asd") -> ERROR
   * safe mod: TO_NUMBER("123asd") -> NULL
   */
});
