import { dateFunctionsToSqlMap } from '../../../../src/Parser/mappers/functions/dateFunctions/sql';

describe('dateFunctionsToSqlMap', () => {
  const exampleDate = "'2024-04-25T12:34:56'";

  test('DATE', () => {
    expect(dateFunctionsToSqlMap.DATE(['2012', '12', '12'])).toBe(
      'MAKE_DATE(2012, 12, 12)',
    );
  });

  test('DATEADD', () => {
    expect(dateFunctionsToSqlMap.DATEADD([exampleDate, '5', "'days'"])).toBe(`
      CASE
        WHEN 'days' = 'second' THEN ('2024-04-25T12:34:56' + INTERVAL  '5 second') WHEN 'days' = 'minute' THEN ('2024-04-25T12:34:56' + INTERVAL  '5 minute') WHEN 'days' = 'hour' THEN ('2024-04-25T12:34:56' + INTERVAL  '5 hour') WHEN 'days' = 'day' THEN ('2024-04-25T12:34:56' + INTERVAL  '5 day') WHEN 'days' = 'week' THEN ('2024-04-25T12:34:56' + INTERVAL  '5 week') WHEN 'days' = 'month' THEN ('2024-04-25T12:34:56' + INTERVAL  '5 month') WHEN 'days' = 'year' THEN ('2024-04-25T12:34:56' + INTERVAL  '5 year')  
        ELSE 1 / 0
      END
    `);
  });

  test('DATETIME_DIFF (seconds)', () => {
    expect(
      dateFunctionsToSqlMap.DATETIME_DIFF([
        exampleDate,
        "'2024-04-24T12:34:56'",
        '"seconds"',
      ]),
    ).toBe(`
      CASE
        WHEN "seconds" = 'second' EXTRACT(second FROM ('2024-04-25T12:34:56' - '2024-04-24T12:34:56')) WHEN "seconds" = 'minute' EXTRACT(minute FROM ('2024-04-25T12:34:56' - '2024-04-24T12:34:56')) WHEN "seconds" = 'hour' EXTRACT(hour FROM ('2024-04-25T12:34:56' - '2024-04-24T12:34:56')) WHEN "seconds" = 'day' EXTRACT(day FROM ('2024-04-25T12:34:56' - '2024-04-24T12:34:56')) WHEN "seconds" = 'week' EXTRACT(week FROM ('2024-04-25T12:34:56' - '2024-04-24T12:34:56')) WHEN "seconds" = 'month' EXTRACT(month FROM ('2024-04-25T12:34:56' - '2024-04-24T12:34:56')) WHEN "seconds" = 'year' EXTRACT(year FROM ('2024-04-25T12:34:56' - '2024-04-24T12:34:56'))  
        ELSE 1 / 0
      END
    `);
  });

  test('DATETIME_FORMAT', () => {
    expect(
      dateFunctionsToSqlMap.DATETIME_FORMAT([exampleDate, "'YYYY-MM-DD'"]),
    ).toBe(`TO_CHAR(${exampleDate}, 'YYYY-MM-DD')`);
  });

  test('DATETIME_PARSE', () => {
    expect(
      dateFunctionsToSqlMap.DATETIME_PARSE(["'25-04-2024'", "'DD-MM-YYYY'"]),
    ).toBe(`TO_TIMESTAMP('25-04-2024', 'DD-MM-YYYY')`);
  });

  test('DAY', () => {
    expect(dateFunctionsToSqlMap.DAY([exampleDate])).toBe(
      `EXTRACT(DAY FROM ${exampleDate})`,
    );
  });

  test('HOUR', () => {
    expect(dateFunctionsToSqlMap.HOUR([exampleDate])).toBe(
      `EXTRACT(HOUR FROM ${exampleDate})`,
    );
  });

  test('MINUTE', () => {
    expect(dateFunctionsToSqlMap.MINUTE([exampleDate])).toBe(
      `EXTRACT(MINUTE FROM ${exampleDate})`,
    );
  });

  test('SECOND', () => {
    expect(dateFunctionsToSqlMap.SECOND([exampleDate])).toBe(
      `EXTRACT(SECOND FROM ${exampleDate})`,
    );
  });

  test('MONTH', () => {
    expect(dateFunctionsToSqlMap.MONTH([exampleDate])).toBe(
      `EXTRACT(MONTH FROM ${exampleDate})`,
    );
  });

  test('YEAR', () => {
    expect(dateFunctionsToSqlMap.YEAR([exampleDate])).toBe(
      `EXTRACT(YEAR FROM ${exampleDate})`,
    );
  });

  test('WEEKDAY', () => {
    expect(dateFunctionsToSqlMap.WEEKDAY([exampleDate])).toBe(
      `EXTRACT(DOW FROM ${exampleDate})`,
    );
  });

  test('WEEKNUM', () => {
    expect(dateFunctionsToSqlMap.WEEKNUM([exampleDate])).toBe(
      `EXTRACT(WEEK FROM ${exampleDate})`,
    );
  });

  test('IS_AFTER', () => {
    expect(
      dateFunctionsToSqlMap.IS_AFTER([exampleDate, "'2024-04-24T12:34:56'"]),
    ).toBe(`(${exampleDate} > '2024-04-24T12:34:56')`);
  });

  test('IS_BEFORE', () => {
    expect(
      dateFunctionsToSqlMap.IS_BEFORE([exampleDate, "'2024-04-24T12:34:56'"]),
    ).toBe(`(${exampleDate} < '2024-04-24T12:34:56')`);
  });

  test('IS_SAME', () => {
    expect(dateFunctionsToSqlMap.IS_SAME([exampleDate, exampleDate])).toBe(
      `(${exampleDate} = ${exampleDate})`,
    );
  });

  test('NOW', () => {
    expect(dateFunctionsToSqlMap.NOW([])).toBe(`NOW()`);
  });

  test('TODAY', () => {
    expect(dateFunctionsToSqlMap.TODAY([])).toBe(`CURRENT_DATE`);
  });
});
