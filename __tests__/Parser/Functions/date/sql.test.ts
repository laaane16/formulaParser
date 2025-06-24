import { Parser } from '../../../../src';

describe('sql date funcs', () => {
  const fields = {
    'Поле 1': {
      id: '1',
      type: 'date',
    },
    'Поле 2': {
      id: '2',
      type: 'date',
    },
  };

  const values = {
    'Поле 1': 'dateColumn',
    'Поле 2': '2dateColumn',
  };

  //For all funcs in comments {Поле 1} = "dateColumn", {Поле 2} = 2005-01-01T00:00:00.000Z
  test('DATE', () => {
    const parser = new Parser('DATE(2012, 12, 12)');
    expect(parser.toSqlWithVariables()).toBe(
      'MAKE_DATE(2012, 12, 12)::TIMESTAMPTZ',
    );
  });
  test('safe DATE', () => {
    const parser = new Parser('DATE(2012, 12, 1)');
    expect(parser.toSqlWithVariables(true)).toBe(
      `(CASE WHEN (2012) >= 0 AND ((12) BETWEEN 0 AND 12) AND EXTRACT(DAY FROM MAKE_DATE(2012, 12, 1) + INTERVAL '1 month' - INTERVAL '1 day') >= (1) AND (1) >= 0 THEN MAKE_DATE(2012, 12, 1) ELSE NULL END)::TIMESTAMPTZ`,
    );
  });
  /**
   * DATE(2012, 12, 1) -> 2012-12-01(date)
   * DATE(2012, 14, 1) -> ERROR
   * safe mode: DATE(2012, 15, 1) -> NULL
   * safe mode: DATE(2012, 12, 35) -> NULL
   * safe mode: DATE(2012, 11, 31) -> NULL (november has 30 days)
   * {Поле 1} = null: DATE(2012, {Поле 1}, 12) -> NULL
   * */

  test('DATEADD', () => {
    const parser = new Parser('DATEADD({Поле 1}, 10, "month")', fields);
    expect(parser.toSqlWithVariables(false, values)).toBe(`
      (CASE ('month')
        WHEN 'second' THEN ((COALESCE("dateColumn", NULL)) + ((10) || ' second')::INTERVAL) WHEN 'minute' THEN ((COALESCE("dateColumn", NULL)) + ((10) || ' minute')::INTERVAL) WHEN 'hour' THEN ((COALESCE("dateColumn", NULL)) + ((10) || ' hour')::INTERVAL) WHEN 'day' THEN ((COALESCE("dateColumn", NULL)) + ((10) || ' day')::INTERVAL) WHEN 'week' THEN ((COALESCE("dateColumn", NULL)) + ((10) || ' week')::INTERVAL) WHEN 'month' THEN ((COALESCE("dateColumn", NULL)) + ((10) || ' month')::INTERVAL) WHEN 'year' THEN ((COALESCE("dateColumn", NULL)) + ((10) || ' year')::INTERVAL)
        ELSE (1 / 0)::text::date
      END)
    `);
  });
  test('safe DATEADD', () => {
    const parser = new Parser('DATEADD({Поле 1}, 10, "month")', fields);
    expect(parser.toSqlWithVariables(true, values)).toBe(`
      (CASE ('month')
        WHEN 'second' THEN ((COALESCE("dateColumn", NULL)) + ((10) || ' second')::INTERVAL) WHEN 'minute' THEN ((COALESCE("dateColumn", NULL)) + ((10) || ' minute')::INTERVAL) WHEN 'hour' THEN ((COALESCE("dateColumn", NULL)) + ((10) || ' hour')::INTERVAL) WHEN 'day' THEN ((COALESCE("dateColumn", NULL)) + ((10) || ' day')::INTERVAL) WHEN 'week' THEN ((COALESCE("dateColumn", NULL)) + ((10) || ' week')::INTERVAL) WHEN 'month' THEN ((COALESCE("dateColumn", NULL)) + ((10) || ' month')::INTERVAL) WHEN 'year' THEN ((COALESCE("dateColumn", NULL)) + ((10) || ' year')::INTERVAL)
        ELSE NULL
      END)
    `);
  });
  /**
   * DATEADD({Поле 1}, 10, 'month') -> 2002-10-12T00:00:00.000Z
   * DATEADD({Поле 1}, -10, 'month') -> 2001-02-12T00:00:00.000Z
   * DATEADD({Поле 1}, 10, 'mth') -> ERROR
   * safe mode: DATEADD({Поле 1}, 10, 'mth') -> NULL
   */

  test('datetime diff', () => {
    const parser = new Parser(
      'DATETIME_DIFF({Поле 1}, {Поле 2}, "month")',
      fields,
    );
    expect(parser.toSqlWithVariables(false, values)).toBe(`
      (CASE ('month')
        WHEN 'second' THEN EXTRACT(second FROM ((COALESCE("dateColumn", NULL)) - (COALESCE("2dateColumn", NULL)))) WHEN 'minute' THEN EXTRACT(minute FROM ((COALESCE("dateColumn", NULL)) - (COALESCE("2dateColumn", NULL)))) WHEN 'hour' THEN EXTRACT(hour FROM ((COALESCE("dateColumn", NULL)) - (COALESCE("2dateColumn", NULL)))) WHEN 'day' THEN EXTRACT(day FROM ((COALESCE("dateColumn", NULL)) - (COALESCE("2dateColumn", NULL)))) WHEN 'week' THEN EXTRACT(week FROM ((COALESCE("dateColumn", NULL)) - (COALESCE("2dateColumn", NULL)))) WHEN 'month' THEN EXTRACT(month FROM ((COALESCE("dateColumn", NULL)) - (COALESCE("2dateColumn", NULL)))) WHEN 'year' THEN EXTRACT(year FROM ((COALESCE("dateColumn", NULL)) - (COALESCE("2dateColumn", NULL))))
        ELSE 1 / 0
      END)
    `);
  });
  test('safe datetime_diff with invalid unit', () => {
    const parser = new Parser(
      'DATETIME_DIFF({Поле 1}, {Поле 2}, "month")',
      fields,
    );
    expect(parser.toSqlWithVariables(true, values)).toBe(`
      (CASE ('month')
        WHEN 'second' THEN EXTRACT(second FROM ((COALESCE("dateColumn", NULL)) - (COALESCE("2dateColumn", NULL)))) WHEN 'minute' THEN EXTRACT(minute FROM ((COALESCE("dateColumn", NULL)) - (COALESCE("2dateColumn", NULL)))) WHEN 'hour' THEN EXTRACT(hour FROM ((COALESCE("dateColumn", NULL)) - (COALESCE("2dateColumn", NULL)))) WHEN 'day' THEN EXTRACT(day FROM ((COALESCE("dateColumn", NULL)) - (COALESCE("2dateColumn", NULL)))) WHEN 'week' THEN EXTRACT(week FROM ((COALESCE("dateColumn", NULL)) - (COALESCE("2dateColumn", NULL)))) WHEN 'month' THEN EXTRACT(month FROM ((COALESCE("dateColumn", NULL)) - (COALESCE("2dateColumn", NULL)))) WHEN 'year' THEN EXTRACT(year FROM ((COALESCE("dateColumn", NULL)) - (COALESCE("2dateColumn", NULL))))
        ELSE NULL
      END)
    `);
  });
  /**
   * DATETIME_DIFF({Поле 1}, {Поле 2} 'month') -> 2002-10-12T00:00:00.000Z
   * DATETIME_DIFF({Поле 1}, {Поле 2}, 'month') -> 2001-02-12T00:00:00.000Z
   * DATETIME_DIFF({Поле 1}, {Поле 2}, 'mth') -> ERROR
   * safe mode: DATETIME_DIFF({Поле 1}, {Поле 2}, 'mth') -> NULL
   */

  // NEED VALIDATE!!!
  test('datetime_format', () => {
    const parser = new Parser('DATETIME_FORMAT({Поле 1}, "YYYY")', fields);

    expect(parser.toSqlWithVariables(false, values)).toBe(
      `TO_CHAR(COALESCE("dateColumn", NULL), 'YYYY')`,
    );
  });
  // // NEED VALIDATE!!!
  // test('datetime_parse', () => {
  //   const parser = new Parser('DATETIME_PARSE("2012", "yyyy")', fields);
  //   expect(() => parser.toSqlWithVariables()).toThrow();
  // });

  test('YEAR', () => {
    const parser = new Parser('YEAR({Поле 1})', fields);
    expect(parser.toSqlWithVariables(false, values)).toBe(
      `EXTRACT(YEAR FROM COALESCE("dateColumn", NULL))`,
    );
  });
  /**
   * YEAR({Поле 1}) -> 2001
   */

  test('MONTH', () => {
    const parser = new Parser('MONTH({Поле 1})', fields);
    expect(parser.toSqlWithVariables(false, values)).toBe(
      `EXTRACT(MONTH FROM COALESCE("dateColumn", NULL))`,
    );
  });
  /**
   * MONTH({Поле 1}) -> 12
   */

  test('weekday', () => {
    const parser = new Parser('WEEKDAY({Поле 1})', fields);
    expect(parser.toSqlWithVariables(false, values)).toBe(
      `(EXTRACT(DOW FROM COALESCE("dateColumn", NULL)) + 1)`,
    );
  });
  /**
   * WEEKDAY({Поле 1}) -> 4
   */

  test('weeknumber', () => {
    const parser = new Parser('WEEKNUM({Поле 1})', fields);
    expect(parser.toSqlWithVariables(false, values)).toBe(
      `EXTRACT(WEEK FROM COALESCE("dateColumn", NULL))`,
    );
  });
  /**
   * WEEKNUM({Поле 1}) -> 50
   */

  test('day', () => {
    const parser = new Parser('DAY({Поле 1})', fields);
    expect(parser.toSqlWithVariables(false, values)).toBe(
      `EXTRACT(DAY FROM COALESCE("dateColumn", NULL))`,
    );
  });
  /**
   * DAY({Поле 1}) -> 12
   */

  test('HOUR', () => {
    const parser = new Parser('HOUR({Поле 1})', fields);
    expect(parser.toSqlWithVariables(false, values)).toBe(
      `EXTRACT(HOUR FROM COALESCE("dateColumn", NULL))`,
    );
  });
  /**
   * HOUR({Поле 1}) -> 0
   */

  test('MINUTE', () => {
    const parser = new Parser('MINUTE({Поле 1})', fields);
    expect(parser.toSqlWithVariables(false, values)).toBe(
      `EXTRACT(MINUTE FROM COALESCE("dateColumn", NULL))`,
    );
  });
  /**
   * MINUTE({Поле 1}) -> 0
   */

  test('SECOND', () => {
    const parser = new Parser('SECOND({Поле 1})', fields);
    expect(parser.toSqlWithVariables(false, values)).toBe(
      `EXTRACT(SECOND FROM COALESCE("dateColumn", NULL))`,
    );
  });
  /**
   * SECOND({Поле 1}) -> 0
   */

  test('IS_AFTER', () => {
    const parser = new Parser('IS_AFTER({Поле 1}, {Поле 2})', fields);
    expect(parser.toSqlWithVariables(false, values)).toBe(
      `(COALESCE("dateColumn", NULL) > COALESCE("2dateColumn", NULL))`,
    );
  });
  /**
   * IS_AFTER({Поле 1}, {Поле 2}) -> FALSE
   */

  test('IS_BEFORE', () => {
    const parser = new Parser('IS_BEFORE({Поле 1}, {Поле 2})', fields);
    expect(parser.toSqlWithVariables(false, values)).toBe(
      `(COALESCE("dateColumn", NULL) < COALESCE("2dateColumn", NULL))`,
    );
  });
  /**
   * IS_BEFORE({Поле 1}, {Поле 2} -> TRUE
   */

  test('IS_SAME', () => {
    const parser = new Parser('IS_SAME({Поле 1}, {Поле 2})', fields);
    expect(parser.toSqlWithVariables(false, values)).toBe(
      `(COALESCE("dateColumn", NULL) = COALESCE("2dateColumn", NULL))`,
    );
  });
  /**
   * IS_SAME({Поле 1}, {Поле 2} -> FALSE
   */

  // test('NOW', () => {
  //   const parser = new Parser('NOW()', fields);
  //   expect(parser.toSqlWithVariables(false, values)).toBe('NOW()');
  // });
  /**
   * NOW() -> '2025-05-20 13:40:49.556364+03'(date)
   */

  test('TODAY', () => {
    const parser = new Parser('TODAY()', fields);
    expect(parser.toSqlWithVariables()).toBe('CURRENT_DATE::TIMESTAMPTZ');
  });
  /**
   * TODAY() -> 2025-05-20 00:00:00
   */
});
