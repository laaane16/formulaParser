import { dateFunctionsToJsMap } from '../../../../src/Parser/mappers/functions/dateFunctions/js';

describe('dateFunctionsToJsMap', () => {
  test('DATE', () => {
    expect(dateFunctionsToJsMap.DATE(['2023', '12', '12'])).toBe(
      `DateTime.fromObject({ day: 12, month:  12, year: 2023}).toFormat("yyyy-LL-dd HH:mm:ssZZZ").slice(0, -2)`,
    );
  });

  test('DATEADD', () => {
    expect(dateFunctionsToJsMap.DATEADD(['"2023-01-01"', '3', '"days"'])).toBe(`
      (function(){
        if ('second'=== ("days")) return DateTime.fromFormat("2023-01-01", "yyyy-LL-dd HH:mm:ssZZZ").plus({ ["days"]: Number(3) }).toFormat("yyyy-LL-dd HH:mm:ssZZZ").slice(0, -2); if ('minute'=== ("days")) return DateTime.fromFormat("2023-01-01", "yyyy-LL-dd HH:mm:ssZZZ").plus({ ["days"]: Number(3) }).toFormat("yyyy-LL-dd HH:mm:ssZZZ").slice(0, -2); if ('hour'=== ("days")) return DateTime.fromFormat("2023-01-01", "yyyy-LL-dd HH:mm:ssZZZ").plus({ ["days"]: Number(3) }).toFormat("yyyy-LL-dd HH:mm:ssZZZ").slice(0, -2); if ('day'=== ("days")) return DateTime.fromFormat("2023-01-01", "yyyy-LL-dd HH:mm:ssZZZ").plus({ ["days"]: Number(3) }).toFormat("yyyy-LL-dd HH:mm:ssZZZ").slice(0, -2); if ('week'=== ("days")) return DateTime.fromFormat("2023-01-01", "yyyy-LL-dd HH:mm:ssZZZ").plus({ ["days"]: Number(3) }).toFormat("yyyy-LL-dd HH:mm:ssZZZ").slice(0, -2); if ('month'=== ("days")) return DateTime.fromFormat("2023-01-01", "yyyy-LL-dd HH:mm:ssZZZ").plus({ ["days"]: Number(3) }).toFormat("yyyy-LL-dd HH:mm:ssZZZ").slice(0, -2); if ('year'=== ("days")) return DateTime.fromFormat("2023-01-01", "yyyy-LL-dd HH:mm:ssZZZ").plus({ ["days"]: Number(3) }).toFormat("yyyy-LL-dd HH:mm:ssZZZ").slice(0, -2);
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
        if ('second' === ("days")) return Math.floor(Math.abs(DateTime.fromFormat("2023-01-01", "yyyy-LL-dd HH:mm:ssZZZ").diff(DateTime.fromFormat("2023-01-05", "yyyy-LL-dd HH:mm:ssZZZ"), "days").as("days"))); if ('minute' === ("days")) return Math.floor(Math.abs(DateTime.fromFormat("2023-01-01", "yyyy-LL-dd HH:mm:ssZZZ").diff(DateTime.fromFormat("2023-01-05", "yyyy-LL-dd HH:mm:ssZZZ"), "days").as("days"))); if ('hour' === ("days")) return Math.floor(Math.abs(DateTime.fromFormat("2023-01-01", "yyyy-LL-dd HH:mm:ssZZZ").diff(DateTime.fromFormat("2023-01-05", "yyyy-LL-dd HH:mm:ssZZZ"), "days").as("days"))); if ('day' === ("days")) return Math.floor(Math.abs(DateTime.fromFormat("2023-01-01", "yyyy-LL-dd HH:mm:ssZZZ").diff(DateTime.fromFormat("2023-01-05", "yyyy-LL-dd HH:mm:ssZZZ"), "days").as("days"))); if ('week' === ("days")) return Math.floor(Math.abs(DateTime.fromFormat("2023-01-01", "yyyy-LL-dd HH:mm:ssZZZ").diff(DateTime.fromFormat("2023-01-05", "yyyy-LL-dd HH:mm:ssZZZ"), "days").as("days"))); if ('month' === ("days")) return Math.floor(Math.abs(DateTime.fromFormat("2023-01-01", "yyyy-LL-dd HH:mm:ssZZZ").diff(DateTime.fromFormat("2023-01-05", "yyyy-LL-dd HH:mm:ssZZZ"), "days").as("days"))); if ('year' === ("days")) return Math.floor(Math.abs(DateTime.fromFormat("2023-01-01", "yyyy-LL-dd HH:mm:ssZZZ").diff(DateTime.fromFormat("2023-01-05", "yyyy-LL-dd HH:mm:ssZZZ"), "days").as("days")));
        throw '';
      })()
    `);
  });

  // test('DATETIME_FORMAT', () => {
  //   expect(
  //     dateFunctionsToJsMap.DATETIME_FORMAT(['"2023-01-01"', '"yyyy-MM-dd"']),
  //   ).toBe(`(function(){
  //   let preparedFormat = "'" + ("yyyy-MM-dd").replaceAll(" ", "' '") + "'";
  //   Object.entries({"msecond":"MS","second":"SS","minute":"MI","hour12":"HH","hour24":"HH24","year":"YYYY","iweekyear":"kkkk","month":"Month","mon":"Mon","mm":"MM","day":"Day","dy":"Dy","ddd":"DDD","dd":"DD","id":"ID","week":"WW","iweek":"IW"}).forEach(
  //     ([key, value]) => {
  //       const matches = preparedFormat.match(new RegExp(\`'\${value}'\`, 'g'));
  //       if (matches && matches.length > 0) {
  //         preparedFormat = preparedFormat.replaceAll("'" + value + "'", {"msecond":"SSS","second":"uu","minute":"mm","hour12":"hh","hour24":"HH","year":"yyyy","iweekyear":"IYYY","month":"LLLL","mon":"LLL","mm":"LL","day":"cccc","dy":"ccc","ddd":"ooo","dd":"dd","id":"c","week":"W","iweek":"WW"}[key]);
  //       }
  //     }
  //   );
  //   return DateTime.fromFormat("2023-01-01", "yyyy-LL-dd HH:mm:ssZZZ").toFormat(preparedFormat)})()`);
  // });

  // test('DATETIME_PARSE', () => {
  //   expect(
  //     dateFunctionsToJsMap.DATETIME_PARSE(['"01-01-2023"', '"dd-MM-yyyy"']),
  //   ).toBe(
  //     `DateTime.fromFormat("01-01-2023", "dd-MM-yyyy").toString()`,
  //   );
  // });

  test('DAY', () => {
    expect(dateFunctionsToJsMap.DAY(['"2023-01-01"'])).toBe(
      `DateTime.fromFormat("2023-01-01", "yyyy-LL-dd HH:mm:ssZZZ").day`,
    );
  });

  test('HOUR', () => {
    expect(dateFunctionsToJsMap.HOUR(['"2023-01-01T12:00:00Z"'])).toBe(
      `DateTime.fromFormat("2023-01-01T12:00:00Z", "yyyy-LL-dd HH:mm:ssZZZ").hour`,
    );
  });

  test('MINUTE', () => {
    expect(dateFunctionsToJsMap.MINUTE(['"2023-01-01T12:34:56Z"'])).toBe(
      `DateTime.fromFormat("2023-01-01T12:34:56Z", "yyyy-LL-dd HH:mm:ssZZZ").minute`,
    );
  });

  test('SECOND', () => {
    expect(dateFunctionsToJsMap.SECOND(['"2023-01-01T12:34:56Z"'])).toBe(
      `DateTime.fromFormat("2023-01-01T12:34:56Z", "yyyy-LL-dd HH:mm:ssZZZ").second`,
    );
  });

  test('MONTH', () => {
    expect(dateFunctionsToJsMap.MONTH(['"2023-02-01"'])).toBe(
      `DateTime.fromFormat("2023-02-01", "yyyy-LL-dd HH:mm:ssZZZ").month`,
    );
  });

  test('YEAR', () => {
    expect(dateFunctionsToJsMap.YEAR(['"2023-02-01"'])).toBe(
      `DateTime.fromFormat("2023-02-01", "yyyy-LL-dd HH:mm:ssZZZ").year`,
    );
  });

  test('WEEKDAY', () => {
    expect(dateFunctionsToJsMap.WEEKDAY(['"2023-02-01"'])).toBe(
      `DateTime.fromFormat("2023-02-01", "yyyy-LL-dd HH:mm:ssZZZ").weekday`,
    );
  });

  test('WEEKNUM', () => {
    expect(dateFunctionsToJsMap.WEEKNUM(['"2023-02-01"'])).toBe(
      `DateTime.fromFormat("2023-02-01", "yyyy-LL-dd HH:mm:ssZZZ").weekNumber`,
    );
  });

  test('IS_AFTER', () => {
    expect(
      dateFunctionsToJsMap.IS_AFTER(['"2023-02-02"', '"2023-01-01"']),
    ).toBe(
      `DateTime.fromFormat("2023-02-02", "yyyy-LL-dd HH:mm:ssZZZ") > DateTime.fromFormat("2023-01-01", "yyyy-LL-dd HH:mm:ssZZZ")`,
    );
  });

  test('IS_BEFORE', () => {
    expect(
      dateFunctionsToJsMap.IS_BEFORE(['"2023-01-01"', '"2023-02-02"']),
    ).toBe(
      `DateTime.fromFormat("2023-01-01", "yyyy-LL-dd HH:mm:ssZZZ") < DateTime.fromFormat("2023-02-02", "yyyy-LL-dd HH:mm:ssZZZ")`,
    );
  });

  test('IS_SAME', () => {
    expect(dateFunctionsToJsMap.IS_SAME(['"2023-01-01"', '"2023-01-01"'])).toBe(
      `("2023-01-01" === "2023-01-01")`,
    );
  });

  // test('NOW', () => {
  //   expect(dateFunctionsToJsMap.NOW([])).toBe(
  //     `DateTime.now().toFormat("yyyy-LL-dd HH:mm:ssZZZ").slice(0, -2)`,
  //   );
  // });

  test('TODAY', () => {
    expect(dateFunctionsToJsMap.TODAY([])).toBe(
      `DateTime.now().startOf('day').toFormat("yyyy-LL-dd HH:mm:ssZZZ").slice(0, -2)`,
    );
  });
});
