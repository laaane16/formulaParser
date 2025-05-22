import { dateFunctionsToJsMap } from '../../../../src/Parser/mappers/functions/dateFunctions/js';

describe('dateFunctionsToJsMap', () => {
  test('DATE', () => {
    expect(dateFunctionsToJsMap.DATE(['2023', '12', '12'])).toBe(
      `DateTime.fromObject({ day: 12, month:  12, year: 2023}, { zone: 'utc'}).toString()`,
    );
  });

  test('DATEADD', () => {
    expect(dateFunctionsToJsMap.DATEADD(['"2023-01-01"', '3', '"days"'])).toBe(`
      (function(){
        if ('second'=== "days") return DateTime.fromISO("2023-01-01", { zone: 'utc'}).plus({ ["days"]: Number(3) }).toString(); if ('minute'=== "days") return DateTime.fromISO("2023-01-01", { zone: 'utc'}).plus({ ["days"]: Number(3) }).toString(); if ('hour'=== "days") return DateTime.fromISO("2023-01-01", { zone: 'utc'}).plus({ ["days"]: Number(3) }).toString(); if ('day'=== "days") return DateTime.fromISO("2023-01-01", { zone: 'utc'}).plus({ ["days"]: Number(3) }).toString(); if ('week'=== "days") return DateTime.fromISO("2023-01-01", { zone: 'utc'}).plus({ ["days"]: Number(3) }).toString(); if ('month'=== "days") return DateTime.fromISO("2023-01-01", { zone: 'utc'}).plus({ ["days"]: Number(3) }).toString(); if ('year'=== "days") return DateTime.fromISO("2023-01-01", { zone: 'utc'}).plus({ ["days"]: Number(3) }).toString();
        throw '';
      })()
    `);
  });

  test('DATETIME_DIFF', () => {
    expect(
      dateFunctionsToJsMap.DATETIME_DIFF([
        '"2023-01-05"',
        '"2023-01-01"',
        '"days"',
      ]),
    ).toBe(`
      (function(){
        if ('second' === "days") return Math.floor(Math.abs(DateTime.fromISO("2023-01-01", { zone: 'utc'}).diff(DateTime.fromISO("2023-01-05"), "days").as("days"))); if ('minute' === "days") return Math.floor(Math.abs(DateTime.fromISO("2023-01-01", { zone: 'utc'}).diff(DateTime.fromISO("2023-01-05"), "days").as("days"))); if ('hour' === "days") return Math.floor(Math.abs(DateTime.fromISO("2023-01-01", { zone: 'utc'}).diff(DateTime.fromISO("2023-01-05"), "days").as("days"))); if ('day' === "days") return Math.floor(Math.abs(DateTime.fromISO("2023-01-01", { zone: 'utc'}).diff(DateTime.fromISO("2023-01-05"), "days").as("days"))); if ('week' === "days") return Math.floor(Math.abs(DateTime.fromISO("2023-01-01", { zone: 'utc'}).diff(DateTime.fromISO("2023-01-05"), "days").as("days"))); if ('month' === "days") return Math.floor(Math.abs(DateTime.fromISO("2023-01-01", { zone: 'utc'}).diff(DateTime.fromISO("2023-01-05"), "days").as("days"))); if ('year' === "days") return Math.floor(Math.abs(DateTime.fromISO("2023-01-01", { zone: 'utc'}).diff(DateTime.fromISO("2023-01-05"), "days").as("days")));
        throw '';
      })()
    `);
  });

  // test('DATETIME_FORMAT', () => {
  //   expect(
  //     dateFunctionsToJsMap.DATETIME_FORMAT(['"2023-01-01"', '"yyyy-MM-dd"']),
  //   ).toBe(
  //     `DateTime.fromISO("2023-01-01", { zone: 'utc'}).toFormat("yyyy-MM-dd")`,
  //   );
  // });

  // test('DATETIME_PARSE', () => {
  //   expect(
  //     dateFunctionsToJsMap.DATETIME_PARSE(['"01-01-2023"', '"dd-MM-yyyy"']),
  //   ).toBe(
  //     `DateTime.fromFormat("01-01-2023", "dd-MM-yyyy", { zone: 'utc'}).toString()`,
  //   );
  // });

  test('DAY', () => {
    expect(dateFunctionsToJsMap.DAY(['"2023-01-01"'])).toBe(
      `DateTime.fromISO("2023-01-01", { zone: 'utc'}).day`,
    );
  });

  test('HOUR', () => {
    expect(dateFunctionsToJsMap.HOUR(['"2023-01-01T12:00:00Z"'])).toBe(
      `DateTime.fromISO("2023-01-01T12:00:00Z", { zone: 'utc'}).hour`,
    );
  });

  test('MINUTE', () => {
    expect(dateFunctionsToJsMap.MINUTE(['"2023-01-01T12:34:56Z"'])).toBe(
      `DateTime.fromISO("2023-01-01T12:34:56Z", { zone: 'utc'}).minute`,
    );
  });

  test('SECOND', () => {
    expect(dateFunctionsToJsMap.SECOND(['"2023-01-01T12:34:56Z"'])).toBe(
      `DateTime.fromISO("2023-01-01T12:34:56Z", { zone: 'utc'}).second`,
    );
  });

  test('MONTH', () => {
    expect(dateFunctionsToJsMap.MONTH(['"2023-02-01"'])).toBe(
      `DateTime.fromISO("2023-02-01", { zone: 'utc'}).month`,
    );
  });

  test('YEAR', () => {
    expect(dateFunctionsToJsMap.YEAR(['"2023-02-01"'])).toBe(
      `DateTime.fromISO("2023-02-01", { zone: 'utc'}).year`,
    );
  });

  test('WEEKDAY', () => {
    expect(dateFunctionsToJsMap.WEEKDAY(['"2023-02-01"'])).toBe(
      `DateTime.fromISO("2023-02-01", { zone: 'utc'}).weekday`,
    );
  });

  test('WEEKNUM', () => {
    expect(dateFunctionsToJsMap.WEEKNUM(['"2023-02-01"'])).toBe(
      `DateTime.fromISO("2023-02-01", { zone: 'utc'}).weekNumber`,
    );
  });

  test('IS_AFTER', () => {
    expect(
      dateFunctionsToJsMap.IS_AFTER(['"2023-02-02"', '"2023-01-01"']),
    ).toBe(
      `DateTime.fromISO("2023-02-02", { zone: 'utc'}) > DateTime.fromISO("2023-01-01", { zone: 'utc'})`,
    );
  });

  test('IS_BEFORE', () => {
    expect(
      dateFunctionsToJsMap.IS_BEFORE(['"2023-01-01"', '"2023-02-02"']),
    ).toBe(
      `DateTime.fromISO("2023-01-01", { zone: 'utc'}) < DateTime.fromISO("2023-02-02", { zone: 'utc'})`,
    );
  });

  test('IS_SAME', () => {
    expect(dateFunctionsToJsMap.IS_SAME(['"2023-01-01"', '"2023-01-01"'])).toBe(
      `DateTime.fromISO("2023-01-01", { zone: 'utc'}).toString() === DateTime.fromISO("2023-01-01", { zone: 'utc'}).toString()`,
    );
  });

  test('NOW', () => {
    expect(dateFunctionsToJsMap.NOW([])).toBe(`DateTime.now().toString()`);
  });

  test('TODAY', () => {
    expect(dateFunctionsToJsMap.TODAY([])).toBe(
      `DateTime.now().startOf('day').toString()`,
    );
  });
});
