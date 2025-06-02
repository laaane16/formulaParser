import { DateTime } from 'luxon';
import { Parser } from '../../../../src';

describe('execute date funcs', () => {
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
    'Поле 1': '2024-01-01 11:00:00+03',
    'Поле 2': '2025-12-12 11:00:00+03',
  };

  test('DATE', () => {
    const parser = new Parser('DATE(2012, 12, 12)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('2012-12-12 00:00:00+04');
  });
  test('DATE with invalid month', () => {
    const parser = new Parser('DATE(2012, 42, 12)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('Invalid DateTi');
  });
  test('safe DATE with invalid month', () => {
    const parser = new Parser('DATE(2012, 23, 1)');
    const js = parser.toJs(true);

    expect(parser.runJs(js)).toBe(null);
  });
  test('DATEADD', () => {
    const parser = new Parser('DATEADD({{Поле 1}}, 10, "month")', fields);
    const js = parser.toJs();

    expect(parser.runJs(js, values)).toBe('2024-11-01 11:00:00+03');
  });
  test('safe DATEADD with invalid unit', () => {
    const parser = new Parser('DATEADD({{Поле 1}}, 10, "mth")', fields);
    const js = parser.toJs(true);

    expect(parser.runJs(js, values)).toBe(null);
  });
  test('datetime diff', () => {
    const parser = new Parser(
      'DATETIME_DIFF({{Поле 1}}, {{Поле 2}}, "month")',
      fields,
    );
    const js = parser.toJs();
    expect(parser.runJs(js, values)).toBe(23);
  });
  test('safe datetime_diff with invalid unit', () => {
    const parser = new Parser(
      'DATETIME_DIFF({{Поле 1}}, {{Поле 2}}, "monthh")',
      fields,
    );
    const js = parser.toJs(true);

    expect(parser.runJs(js, values)).toBe(null);
  });
  test('datetime_format', () => {
    const parser = new Parser('DATETIME_FORMAT({{Поле 1}}, "YYYY")', fields);
    const js = parser.toJs(true);

    expect(parser.runJs(js, values)).toBe('2024');
  });
  // // NEED VALIDATION FOR FORMAT IN SAFE MODE
  // test('invalid datetime_format', () => {
  //   const parser = new Parser('DATETIME_FORMAT({{Поле 1}}, "YYYY")', fields);
  //   const js = parser.toJs(true);

  //   expect(() => parser.runJs(js, values)).toThrow();
  // });
  // test('datetime_parse', () => {
  //   const parser = new Parser('DATETIME_PARSE("2012", "yyyy")', fields);
  //   const js = parser.toJs();

  //   expect(parser.runJs(js, values)).toBe('2012-01-01T00:00:00.000Z');
  // });
  // // NEED VALIDATION FOR FORMAT IN SAFE MODE
  // test('invalid format in datetime_parse', () => {
  //   const parser = new Parser('DATETIME_PARSE("2012", "YYYY")', fields);
  //   const js = parser.toJs();

  //   expect(parser.runJs(js, values)).toBe('2012-01-01T00:00:00.000Z');
  // });
  test('YEAR', () => {
    const parser = new Parser('YEAR({{Поле 1}})', fields);
    const js = parser.toJs();

    expect(parser.runJs(js, values)).toBe(2024);
  });
  test('MONTH', () => {
    const parser = new Parser('MONTH({{Поле 1}})', fields);
    const js = parser.toJs();

    expect(parser.runJs(js, values)).toBe(1);
  });
  test('weekday', () => {
    const parser = new Parser('WEEKDAY({{Поле 1}})', fields);
    const js = parser.toJs();

    expect(parser.runJs(js, values)).toBe(1);
  });
  test('weeknumber', () => {
    const parser = new Parser('WEEKNUM({{Поле 1}})', fields);
    const js = parser.toJs();

    expect(parser.runJs(js, values)).toBe(1);
  });
  test('day', () => {
    const parser = new Parser('DAY({{Поле 1}})', fields);
    const js = parser.toJs();

    expect(parser.runJs(js, values)).toBe(1);
  });
  test('HOUR', () => {
    const parser = new Parser('HOUR({{Поле 1}})', fields);
    const js = parser.toJs();

    expect(parser.runJs(js, values)).toBe(11);
  });
  test('MINUTE', () => {
    const parser = new Parser('MINUTE({{Поле 1}})', fields);
    const js = parser.toJs();

    expect(parser.runJs(js, values)).toBe(0);
  });
  test('SECOND', () => {
    const parser = new Parser('SECOND({{Поле 1}})', fields);
    const js = parser.toJs();

    expect(parser.runJs(js, values)).toBe(0);
  });
  test('IS_AFTER', () => {
    const parser = new Parser('IS_AFTER({{Поле 1}}, {{Поле 2}})', fields);
    const js = parser.toJs();

    expect(parser.runJs(js, values)).toBe(false);
  });
  test('IS_BEFORE', () => {
    const parser = new Parser('IS_BEFORE({{Поле 1}}, {{Поле 2}})', fields);
    const js = parser.toJs();

    expect(parser.runJs(js, values)).toBe(true);
  });
  test('IS_SAME', () => {
    const parser = new Parser('IS_SAME({{Поле 1}}, {{Поле 2}})', fields);
    const js = parser.toJs();

    expect(parser.runJs(js, values)).toBe(false);
  });
  test('NOW', () => {
    const parser = new Parser('NOW()', fields);
    const js = parser.toJs();

    expect(typeof parser.runJs(js, values)).toBe('string');
  });
  test('TODAY', () => {
    const parser = new Parser('TODAY()', fields);
    const js = parser.toJs();

    expect(parser.runJs(js, values)).toBe(
      DateTime.now()
        .startOf('day')
        .toFormat('yyyy-LL-dd HH:mm:ssZZZ')
        .slice(0, -2),
    );
  });
  test('DATE IN DATEADD', () => {
    const parser = new Parser('DATEADD(DATE(2001,12,12), 12, "day")', fields);
    const js = parser.toJs();

    expect(parser.runJs(js, values)).toBe('2001-12-24 00:00:00+03');
  });
});
