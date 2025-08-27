import { dateFunctionsToJsMap } from '../../../../src/Parser/mappers/functions/dateFunctions/js';

describe('dateFunctionsToJsMap', () => {
  test('DATE', () => {
    expect(dateFunctionsToJsMap.DATE(['2023', '12', '12'])).toBe(
      `(function () {
        let dt = DateTime.fromObject({ year: 2023, month: 1, day: 1});
        dt = dt.plus({ months: 12 - 1, days: 12 - 1, hours: 0, minutes: 0, seconds: 0 });
        return dt;
        })().toFormat("yyyy-LL-dd HH:mm:ssZZZ").slice(0, -2)`,
    );
  });

  test('DATEADD', () => {
    expect(dateFunctionsToJsMap.DATEADD(['"2023-01-01"', '3', '"s"'])).toBe(`
      (function(){
        if ('s'=== ("s")) return DateTime.fromFormat("2023-01-01", "yyyy-LL-dd HH:mm:ssZZZ").plus({ 'second': Number(3) }).toFormat("yyyy-LL-dd HH:mm:ssZZZ").slice(0, -2); if ('mi'=== ("s")) return DateTime.fromFormat("2023-01-01", "yyyy-LL-dd HH:mm:ssZZZ").plus({ 'minute': Number(3) }).toFormat("yyyy-LL-dd HH:mm:ssZZZ").slice(0, -2); if ('h'=== ("s")) return DateTime.fromFormat("2023-01-01", "yyyy-LL-dd HH:mm:ssZZZ").plus({ 'hour': Number(3) }).toFormat("yyyy-LL-dd HH:mm:ssZZZ").slice(0, -2); if ('d'=== ("s")) return DateTime.fromFormat("2023-01-01", "yyyy-LL-dd HH:mm:ssZZZ").plus({ 'day': Number(3) }).toFormat("yyyy-LL-dd HH:mm:ssZZZ").slice(0, -2); if ('w'=== ("s")) return DateTime.fromFormat("2023-01-01", "yyyy-LL-dd HH:mm:ssZZZ").plus({ 'week': Number(3) }).toFormat("yyyy-LL-dd HH:mm:ssZZZ").slice(0, -2); if ('m'=== ("s")) return DateTime.fromFormat("2023-01-01", "yyyy-LL-dd HH:mm:ssZZZ").plus({ 'month': Number(3) }).toFormat("yyyy-LL-dd HH:mm:ssZZZ").slice(0, -2); if ('y'=== ("s")) return DateTime.fromFormat("2023-01-01", "yyyy-LL-dd HH:mm:ssZZZ").plus({ 'year': Number(3) }).toFormat("yyyy-LL-dd HH:mm:ssZZZ").slice(0, -2);
        throw '';
      })()
    `);
  });

  test('DATEDIFF', () => {
    expect(
      dateFunctionsToJsMap.DATEDIFF(['"2023-01-05"', '"2023-01-01"', '"s"']),
    ).toBe(`
      (function(){
        if ('s' === ("s")) return Math.floor(Math.abs(DateTime.fromFormat("2023-01-01", "yyyy-LL-dd HH:mm:ssZZZ").diff(DateTime.fromFormat("2023-01-05", "yyyy-LL-dd HH:mm:ssZZZ"), 'second').as('second'))); if ('mi' === ("s")) return Math.floor(Math.abs(DateTime.fromFormat("2023-01-01", "yyyy-LL-dd HH:mm:ssZZZ").diff(DateTime.fromFormat("2023-01-05", "yyyy-LL-dd HH:mm:ssZZZ"), 'minute').as('minute'))); if ('h' === ("s")) return Math.floor(Math.abs(DateTime.fromFormat("2023-01-01", "yyyy-LL-dd HH:mm:ssZZZ").diff(DateTime.fromFormat("2023-01-05", "yyyy-LL-dd HH:mm:ssZZZ"), 'hour').as('hour'))); if ('d' === ("s")) return Math.floor(Math.abs(DateTime.fromFormat("2023-01-01", "yyyy-LL-dd HH:mm:ssZZZ").diff(DateTime.fromFormat("2023-01-05", "yyyy-LL-dd HH:mm:ssZZZ"), 'day').as('day'))); if ('w' === ("s")) return Math.floor(Math.abs(DateTime.fromFormat("2023-01-01", "yyyy-LL-dd HH:mm:ssZZZ").diff(DateTime.fromFormat("2023-01-05", "yyyy-LL-dd HH:mm:ssZZZ"), 'week').as('week'))); if ('m' === ("s")) return Math.floor(Math.abs(DateTime.fromFormat("2023-01-01", "yyyy-LL-dd HH:mm:ssZZZ").diff(DateTime.fromFormat("2023-01-05", "yyyy-LL-dd HH:mm:ssZZZ"), 'month').as('month'))); if ('y' === ("s")) return Math.floor(Math.abs(DateTime.fromFormat("2023-01-01", "yyyy-LL-dd HH:mm:ssZZZ").diff(DateTime.fromFormat("2023-01-05", "yyyy-LL-dd HH:mm:ssZZZ"), 'year').as('year')));
        throw '';
      })()
    `);
  });

  // test('DATEFORMAT', () => {
  //   expect(
  //     dateFunctionsToJsMap.DATEFORMAT(['"2023-01-01"', '"yyyy-MM-dd"']),
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

  // test('DATEPARSE', () => {
  //   expect(
  //     dateFunctionsToJsMap.DATEPARSE(['"01-01-2023"', '"dd-MM-yyyy"']),
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

  // test('NOW', () => {
  //   expect(dateFunctionsToJsMap.NOW([])).toBe(
  //     `DateTime.now().toFormat("yyyy-LL-dd HH:mm:ssZZZ").slice(0, -2)`,
  //   );
  // });

  // test('TODAY', () => {
  //   expect(dateFunctionsToJsMap.TODAY([])).toBe(
  //     `DateTime.now().startOf('day').toFormat("yyyy-LL-dd HH:mm:ssZZZ").slice(0, -2)`,
  //   );
  // });
});
