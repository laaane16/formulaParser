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
      'MAKE_TIMESTAMP(2012, 12, 12, 0, 0, 0)::TIMESTAMPTZ',
    );
  });
  test('safe DATE', () => {
    const parser = new Parser('DATE(2012, 12, 1)');
    expect(parser.toSqlWithVariables(true)).toBe(
      `(MAKE_DATE(2012, 1, 1)
        + ((12) - 1) * interval '1 month'
        + ((1) - 1) * interval '1 day'
        + (0) * interval '1 hour'
        + (0) * interval '1 minute'
        + (0) * interval '1 second')::TIMESTAMPTZ`,
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
        WHEN 's' THEN ((COALESCE("dateColumn", NULL)) + ((10) || ' second')::INTERVAL) WHEN 'mi' THEN ((COALESCE("dateColumn", NULL)) + ((10) || ' minute')::INTERVAL) WHEN 'h' THEN ((COALESCE("dateColumn", NULL)) + ((10) || ' hour')::INTERVAL) WHEN 'd' THEN ((COALESCE("dateColumn", NULL)) + ((10) || ' day')::INTERVAL) WHEN 'w' THEN ((COALESCE("dateColumn", NULL)) + ((10) || ' week')::INTERVAL) WHEN 'm' THEN ((COALESCE("dateColumn", NULL)) + ((10) || ' month')::INTERVAL) WHEN 'y' THEN ((COALESCE("dateColumn", NULL)) + ((10) || ' year')::INTERVAL)
        ELSE (1 / 0)::text::date
      END)
    `);
  });
  test('safe DATEADD', () => {
    const parser = new Parser('DATEADD({Поле 1}, 10, "month")', fields);
    expect(parser.toSqlWithVariables(true, values)).toBe(`
      (CASE ('month')
        WHEN 's' THEN ((COALESCE("dateColumn", NULL)) + ((10) || ' second')::INTERVAL) WHEN 'mi' THEN ((COALESCE("dateColumn", NULL)) + ((10) || ' minute')::INTERVAL) WHEN 'h' THEN ((COALESCE("dateColumn", NULL)) + ((10) || ' hour')::INTERVAL) WHEN 'd' THEN ((COALESCE("dateColumn", NULL)) + ((10) || ' day')::INTERVAL) WHEN 'w' THEN ((COALESCE("dateColumn", NULL)) + ((10) || ' week')::INTERVAL) WHEN 'm' THEN ((COALESCE("dateColumn", NULL)) + ((10) || ' month')::INTERVAL) WHEN 'y' THEN ((COALESCE("dateColumn", NULL)) + ((10) || ' year')::INTERVAL)
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

  test('date diff', () => {
    const parser = new Parser('DATEDIFF({Поле 1}, {Поле 2}, "month")', fields);
    expect(parser.toSqlWithVariables(false, values)).toBe(`ABS(CASE ('month')
      WHEN 'y' THEN ABS(EXTRACT(YEAR FROM AGE(COALESCE("2dateColumn", NULL), COALESCE("dateColumn", NULL))))
      WHEN 'm' THEN ABS(EXTRACT(YEAR FROM AGE(COALESCE("2dateColumn", NULL), COALESCE("dateColumn", NULL))) * 12) + EXTRACT(MONTH FROM AGE(COALESCE("2dateColumn", NULL), COALESCE("dateColumn", NULL)))
      WHEN 'd' THEN
          FLOOR((EXTRACT(EPOCH FROM (COALESCE("2dateColumn", NULL))) - EXTRACT(EPOCH FROM (COALESCE("dateColumn", NULL)))) / 86400)
      WHEN 'h' THEN
          FLOOR((EXTRACT(EPOCH FROM (COALESCE("2dateColumn", NULL))) - EXTRACT(EPOCH FROM (COALESCE("dateColumn", NULL)))) / 3600)
      WHEN 'mi' THEN
          FLOOR((EXTRACT(EPOCH FROM (COALESCE("2dateColumn", NULL))) - EXTRACT(EPOCH FROM (COALESCE("dateColumn", NULL)))) / 60)
      WHEN 's' THEN
          FLOOR(EXTRACT(EPOCH FROM (COALESCE("2dateColumn", NULL))) - EXTRACT(EPOCH FROM (COALESCE("dateColumn", NULL))))
      ELSE 1 / 0
    END)`);
  });
  test('safe datediff', () => {
    const parser = new Parser('DATEDIFF({Поле 1}, {Поле 2}, "month")', fields);
    expect(parser.toSqlWithVariables(true, values)).toBe(`ABS(CASE ('month')
      WHEN 'y' THEN ABS(EXTRACT(YEAR FROM AGE(COALESCE("2dateColumn", NULL), COALESCE("dateColumn", NULL))))
      WHEN 'm' THEN ABS(EXTRACT(YEAR FROM AGE(COALESCE("2dateColumn", NULL), COALESCE("dateColumn", NULL))) * 12) + EXTRACT(MONTH FROM AGE(COALESCE("2dateColumn", NULL), COALESCE("dateColumn", NULL)))
      WHEN 'w' THEN
          FLOOR((EXTRACT(EPOCH FROM (COALESCE("2dateColumn", NULL))) - EXTRACT(EPOCH FROM (COALESCE("dateColumn", NULL)))) / 604800)
      WHEN 'd' THEN
          FLOOR((EXTRACT(EPOCH FROM (COALESCE("2dateColumn", NULL))) - EXTRACT(EPOCH FROM (COALESCE("dateColumn", NULL)))) / 86400)
      WHEN 'h' THEN
          FLOOR((EXTRACT(EPOCH FROM (COALESCE("2dateColumn", NULL))) - EXTRACT(EPOCH FROM (COALESCE("dateColumn", NULL)))) / 3600)
      WHEN 'mi' THEN
          FLOOR((EXTRACT(EPOCH FROM (COALESCE("2dateColumn", NULL))) - EXTRACT(EPOCH FROM (COALESCE("dateColumn", NULL)))) / 60)
      WHEN 's' THEN
          FLOOR(EXTRACT(EPOCH FROM (COALESCE("2dateColumn", NULL))) - EXTRACT(EPOCH FROM (COALESCE("dateColumn", NULL))))
      ELSE NULL
    END)`);
  });
  /**
   * DATEDIFF({Поле 1}, {Поле 2} 'month') -> 2002-10-12T00:00:00.000Z
   * DATEDIFF({Поле 1}, {Поле 2}, 'month') -> 2001-02-12T00:00:00.000Z
   * DATEDIFF({Поле 1}, {Поле 2}, 'mth') -> ERROR
   * safe mode: DATEDIFF({Поле 1}, {Поле 2}, 'mth') -> NULL
   */

  // NEED VALIDATE!!!
  // test('dateformat', () => {
  //   const parser = new Parser('DATEFORMAT({Поле 1}, "YYYY")', fields);

  //   expect(parser.toSqlWithVariables(false, values)).toBe(
  //     `TO_CHAR(COALESCE("dateColumn", NULL), 'YYYY')`,
  //   );
  // });
  // // NEED VALIDATE!!!
  // test('dateparse', () => {
  //   const parser = new Parser('DATEPARSE("2012", "yyyy")', fields);
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
      `(CASE WHEN EXTRACT(DOW FROM COALESCE("dateColumn", NULL)) = 0 THEN 7 ELSE EXTRACT(DOW FROM COALESCE("dateColumn", NULL)) END)`,
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

  test('STARTOF month', () => {
    const parser = new Parser('STARTOF(DATE(2025,12,12), "m")', fields);
    expect(parser.toSqlWithVariables(false, values)).toBe(`(CASE ('m')
        WHEN 's' THEN DATE_TRUNC('second', MAKE_TIMESTAMP(2025, 12, 12, 0, 0, 0)::TIMESTAMPTZ) WHEN 'mi' THEN DATE_TRUNC('minute', MAKE_TIMESTAMP(2025, 12, 12, 0, 0, 0)::TIMESTAMPTZ) WHEN 'h' THEN DATE_TRUNC('hour', MAKE_TIMESTAMP(2025, 12, 12, 0, 0, 0)::TIMESTAMPTZ) WHEN 'd' THEN DATE_TRUNC('day', MAKE_TIMESTAMP(2025, 12, 12, 0, 0, 0)::TIMESTAMPTZ) WHEN 'w' THEN DATE_TRUNC('week', MAKE_TIMESTAMP(2025, 12, 12, 0, 0, 0)::TIMESTAMPTZ) WHEN 'm' THEN DATE_TRUNC('month', MAKE_TIMESTAMP(2025, 12, 12, 0, 0, 0)::TIMESTAMPTZ) WHEN 'y' THEN DATE_TRUNC('year', MAKE_TIMESTAMP(2025, 12, 12, 0, 0, 0)::TIMESTAMPTZ)
        ELSE NULL
      END)`);
  });

  test('ENDOF month', () => {
    const parser = new Parser('ENDOF(DATE(2025,12,12), "m")', fields);
    expect(parser.toSqlWithVariables(false, values)).toBe(`(CASE ('m')
        WHEN 's' THEN (DATE_TRUNC('second', MAKE_TIMESTAMP(2025, 12, 12, 0, 0, 0)::TIMESTAMPTZ) + INTERVAL '1 second' - INTERVAL '1 second') WHEN 'mi' THEN (DATE_TRUNC('minute', MAKE_TIMESTAMP(2025, 12, 12, 0, 0, 0)::TIMESTAMPTZ) + INTERVAL '1 minute' - INTERVAL '1 second') WHEN 'h' THEN (DATE_TRUNC('hour', MAKE_TIMESTAMP(2025, 12, 12, 0, 0, 0)::TIMESTAMPTZ) + INTERVAL '1 hour' - INTERVAL '1 second') WHEN 'd' THEN (DATE_TRUNC('day', MAKE_TIMESTAMP(2025, 12, 12, 0, 0, 0)::TIMESTAMPTZ) + INTERVAL '1 day' - INTERVAL '1 second') WHEN 'w' THEN (DATE_TRUNC('week', MAKE_TIMESTAMP(2025, 12, 12, 0, 0, 0)::TIMESTAMPTZ) + INTERVAL '1 week' - INTERVAL '1 second') WHEN 'm' THEN (DATE_TRUNC('month', MAKE_TIMESTAMP(2025, 12, 12, 0, 0, 0)::TIMESTAMPTZ) + INTERVAL '1 month' - INTERVAL '1 second') WHEN 'y' THEN (DATE_TRUNC('year', MAKE_TIMESTAMP(2025, 12, 12, 0, 0, 0)::TIMESTAMPTZ) + INTERVAL '1 year' - INTERVAL '1 second')
        ELSE NULL
      END)`);
  });
  test('quarter', () => {
    const parser = new Parser('QUARTER(DATE(2012,12,12))', fields);
    expect(parser.toSqlWithVariables(true, values))
      .toBe(`EXTRACT(QUARTER FROM (MAKE_DATE(2012, 1, 1)
        + ((12) - 1) * interval '1 month'
        + ((12) - 1) * interval '1 day'
        + (0) * interval '1 hour'
        + (0) * interval '1 minute'
        + (0) * interval '1 second')::TIMESTAMPTZ)`);
  });

  test('setday', () => {
    const parser = new Parser('SETDAY({Поле 1}, 15)', fields);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(COALESCE("dateColumn", NULL) + MAKE_INTERVAL(DAYS := (15)::INT - EXTRACT(DAY FROM (COALESCE("dateColumn", NULL)))::INT))`,
    );
  });
  test('SETMONTH', () => {
    const parser = new Parser('SETMONTH({Поле 1}, 15)', fields);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(COALESCE("dateColumn", NULL) + MAKE_INTERVAL(MONTHS := (15)::INT - EXTRACT(MONTH FROM (COALESCE("dateColumn", NULL)))::INT))`,
    );
  });
  test('SETYEAR', () => {
    const parser = new Parser('SETYEAR({Поле 1}, 2003)', fields);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(COALESCE("dateColumn", NULL) + MAKE_INTERVAL(YEARS := (2003)::INT - EXTRACT(YEAR FROM (COALESCE("dateColumn", NULL)))::INT))`,
    );
  });
  test('SETQUARTER', () => {
    const parser = new Parser('SETQUARTER({Поле 1}, 2)', fields);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(COALESCE("dateColumn", NULL) + MAKE_INTERVAL(MONTHS := (((2) - 1) * 3 + 1)::INT - EXTRACT(MONTH FROM (COALESCE("dateColumn", NULL)))::INT))`,
    );
  });
  test('SETWEEKNUM', () => {
    const parser = new Parser('SETWEEKNUM({Поле 1}, 5)', fields);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(COALESCE("dateColumn", NULL) + MAKE_INTERVAL(WEEKS := (5)::INT - EXTRACT(WEEK FROM (COALESCE("dateColumn", NULL)))::INT))`,
    );
  });
  test('SETWEEKDAY', () => {
    const parser = new Parser('SETWEEKDAY({Поле 1}, 6)', fields);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(COALESCE("dateColumn", NULL) + MAKE_INTERVAL(DAYS := (6)::INT - (CASE WHEN EXTRACT(DOW FROM COALESCE("dateColumn", NULL)) = 0 THEN 7 ELSE EXTRACT(DOW FROM COALESCE("dateColumn", NULL)) END)::INT))`,
    );
  });
  test('SETTIME', () => {
    const parser = new Parser('SETTIME({Поле 1}, 12,12, 12)', fields);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(COALESCE("dateColumn", NULL) + MAKE_INTERVAL(HOURS := ((12)::INT - EXTRACT(HOUR FROM (COALESCE("dateColumn", NULL)))::INT), MINS := ((12)::INT - EXTRACT(MINUTE FROM (COALESCE("dateColumn", NULL)))::INT), SECS := ((12)::INT - FLOOR(EXTRACT(SECOND FROM (COALESCE("dateColumn", NULL)))))))`,
    );
  });
  test('SETHOUR', () => {
    const parser = new Parser('SETHOUR({Поле 1}, 3)', fields);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(COALESCE("dateColumn", NULL) + MAKE_INTERVAL(HOURS := (3)::INT - EXTRACT(HOUR FROM (COALESCE("dateColumn", NULL)))::INT))`,
    );
  });
  test('SETMINUTE', () => {
    const parser = new Parser('SETMINUTE({Поле 1}, 3)', fields);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(COALESCE("dateColumn", NULL) + MAKE_INTERVAL(MINS := (3)::INT - EXTRACT(MINUTE FROM (COALESCE("dateColumn", NULL)))::INT))`,
    );
  });
  test('SETSECOND', () => {
    const parser = new Parser('SETSECOND({Поле 1}, 3)', fields);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `(COALESCE("dateColumn", NULL) + MAKE_INTERVAL(SECS := (3)::INT - FLOOR(EXTRACT(SECOND FROM (COALESCE("dateColumn", NULL))))))`,
    );
  });
  test('TIMESTAMP', () => {
    const parser = new Parser('TIMESTAMP({Поле 1})', fields);
    expect(parser.toSqlWithVariables(true, values)).toBe(
      `EXTRACT(EPOCH FROM COALESCE("dateColumn", NULL))`,
    );
  });

  // test('NOW', () => {
  //   const parser = new Parser('NOW()', fields);
  //   expect(parser.toSqlWithVariables(false, values)).toBe('NOW()');
  // });
  /**
   * NOW() -> '2025-05-20 13:40:49.556364+03'(date)
   */

  // test('TODAY', () => {
  //   const parser = new Parser('TODAY()', fields);
  //   expect(parser.toSqlWithVariables()).toBe('CURRENT_DATE::TIMESTAMPTZ');
  // });
  /**
   * TODAY() -> 2025-05-20 00:00:00
   */
});
