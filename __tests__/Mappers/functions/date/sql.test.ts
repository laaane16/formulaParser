// __tests__/dateFunctionsToSqlMap.test.ts
import { dateFunctionsToSqlMap } from '../../../../src/Parser/mappers/functions/dateFunctions/sql';

describe('dateFunctionsToSqlMap', () => {
  const exampleDate = "'2024-04-25T12:34:56'";

  test('DATE', () => {
    expect(dateFunctionsToSqlMap.DATE([exampleDate])).toBe(exampleDate);
  });

  test('DATEADD', () => {
    expect(dateFunctionsToSqlMap.DATEADD([exampleDate, '5', 'days'])).toBe(
      `(${exampleDate} + INTERVAL '5 days')`,
    );
  });

  test('DATETIME_DIFF (seconds)', () => {
    expect(
      dateFunctionsToSqlMap.DATETIME_DIFF([
        exampleDate,
        "'2024-04-24T12:34:56'",
        '"seconds"',
      ]),
    ).toBe(
      `(EXTRACT(EPOCH FROM (${exampleDate} - '2024-04-24T12:34:56')) / 1)`,
    );
  });

  test('DATETIME_DIFF (days)', () => {
    expect(
      dateFunctionsToSqlMap.DATETIME_DIFF([
        exampleDate,
        "'2024-04-24T12:34:56'",
        '"days"',
      ]),
    ).toBe(
      `(EXTRACT(EPOCH FROM (${exampleDate} - '2024-04-24T12:34:56')) / 86400)`,
    );
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

  test('DATETIME_DIFF throws for unsupported unit', () => {
    expect(() =>
      dateFunctionsToSqlMap.DATETIME_DIFF([
        exampleDate,
        exampleDate,
        '"fortnights"',
      ]),
    ).toThrow('Unsupported unit: "fortnights"');
  });
});
