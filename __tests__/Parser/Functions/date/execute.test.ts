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

    expect(parser.runJs(js)).toBe('2015-06-12 00:00:00+03');
  });
  test('DATE with time', () => {
    const parser = new Parser('DATE(2012, 12, 12, 1, 1, 1)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('2012-12-12 01:01:01+04');
  });
  test('DATE with time without seconds', () => {
    const parser = new Parser('DATE(2012, 12, 12, 1, 1)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('2012-12-12 01:01:00+04');
  });
  test('DATE can work with minus', () => {
    const parser = new Parser('DATE(2012, 1, -1)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('2011-12-30 00:00:00+04');
  });

  test('safe DATE with invalid month', () => {
    const parser = new Parser('DATE(2012, 23, 1)');
    const js = parser.toJs(true);

    expect(parser.runJs(js)).toBe('2013-11-01 00:00:00+04');
  });
  test('safe DATE with time', () => {
    const parser = new Parser('DATE(2012, 12, 12, 1, 1, 1)');
    const js = parser.toJs(true);

    expect(parser.runJs(js)).toBe('2012-12-12 01:01:01+04');
  });
  test('safe DATE with time without seconds', () => {
    const parser = new Parser('DATE(2012, 12, 12, 1, 1)');
    const js = parser.toJs(true);

    expect(parser.runJs(js)).toBe('2012-12-12 01:01:00+04');
  });
  test('safe DATE can work with minus', () => {
    const parser = new Parser('DATE(2012, 1, -1)');
    const js = parser.toJs(true);

    expect(parser.runJs(js)).toBe('2011-12-30 00:00:00+04');
  });

  test('DATEADD', () => {
    const parser = new Parser('DATEADD({Поле 1}, 10, "m")', fields);
    const js = parser.toJs();
    console.log(js);
    expect(parser.runJs(js, values)).toBe('2024-11-01 11:00:00+03');
  });
  test('safe DATEADD with invalid unit', () => {
    const parser = new Parser('DATEADD({Поле 1}, 10, "mth")', fields);
    const js = parser.toJs(true);

    expect(parser.runJs(js, values)).toBe(null);
  });
  test('date diff', () => {
    const parser = new Parser('DATEDIFF({Поле 1}, {Поле 2}, "m")', fields);
    const js = parser.toJs();
    expect(parser.runJs(js, values)).toBe(23);
  });
  test('safe datediff with invalid unit', () => {
    const parser = new Parser('DATEDIFF({Поле 1}, {Поле 2}, "monthh")', fields);
    const js = parser.toJs(true);

    expect(parser.runJs(js, values)).toBe(null);
  });

  test('safe datediff in mins', () => {
    const parser = new Parser(
      'DATEDIFF(DATE(2002,1,1), DATE(2004, 2,6,6,13), "mi")',
      fields,
    );
    const js = parser.toJs(true);

    expect(parser.runJs(js, values)).toBe(1103413);
  });

  test('safe STARTOF month', () => {
    const parser = new Parser('DAY(STARTOF(DATE(2025,12,12), "m"))', fields);
    const js = parser.toJs(true);

    expect(parser.runJs(js, values)).toBe(1);
  });

  test('safe ENDOF month', () => {
    const parser = new Parser('DAY(ENDOF(DATE(2025,12,12), "m"))', fields);
    const js = parser.toJs(true);

    expect(parser.runJs(js, values)).toBe(31);
  });
  test('setday', () => {
    const parser = new Parser('DAY(SETDAY(DATE(2012,12,12), 15))', fields);
    const js = parser.toJs();
    expect(parser.runJs(js, values)).toBe(15);
  });
  test('SETMONTH', () => {
    const parser = new Parser('MONTH(SETMONTH(DATE(2012,12,12), 15))', fields);
    const js = parser.toJs();
    expect(parser.runJs(js, values)).toBe(3);
  });
  test('SETYEAR', () => {
    const parser = new Parser('YEAR(SETYEAR(DATE(2012,12,12), 2003))', fields);
    const js = parser.toJs();
    expect(parser.runJs(js, values)).toBe(2003);
  });
  test('SETQUARTER', () => {
    const parser = new Parser(
      'QUARTER(SETQUARTER(DATE(2012,12,12), 2))',
      fields,
    );
    const js = parser.toJs();
    expect(parser.runJs(js, values)).toBe(2);
  });
  test('SETWEEKNUM', () => {
    const parser = new Parser(
      'WEEKNUM(SETWEEKNUM(DATE(2012,12,12), 5))',
      fields,
    );
    const js = parser.toJs();
    expect(parser.runJs(js, values)).toBe(5);
  });
  test('SETWEEKDAY', () => {
    const parser = new Parser(
      'WEEKDAY(SETWEEKDAY(DATE(2012,12,12), 6))',
      fields,
    );
    const js = parser.toJs();
    expect(parser.runJs(js, values)).toBe(6);
  });
  test('SETTIME', () => {
    const parser = new Parser(
      'MINUTE(SETTIME(DATE(2012,12,12), 12,12,12))',
      fields,
    );
    const js = parser.toJs();
    expect(parser.runJs(js, values)).toBe(12);
  });
  test('SETHOUR', () => {
    const parser = new Parser('HOUR(SETHOUR(DATE(2012,12,12), 3))', fields);
    const js = parser.toJs();
    expect(parser.runJs(js, values)).toBe(3);
  });
  test('SETMINUTE', () => {
    const parser = new Parser('MINUTE(SETMINUTE(DATE(2012,12,12), 3))', fields);
    const js = parser.toJs();
    expect(parser.runJs(js, values)).toBe(3);
  });
  test('SETSECOND', () => {
    const parser = new Parser('SECOND(SETSECOND(DATE(2012,12,12), 3))', fields);
    const js = parser.toJs();
    expect(parser.runJs(js, values)).toBe(3);
  });
  test('TIMESTAMP', () => {
    const parser = new Parser('TIMESTAMP(DATE(2012,12,12))', fields);
    const js = parser.toJs();
    expect(parser.runJs(js, values)).toBe(1355256000);
  });

  // test('dateformat', () => {
  //   const parser = new Parser('DATEFORMAT({Поле 1}, "YYYY")', fields);
  //   const js = parser.toJs(true);

  //   expect(parser.runJs(js, values)).toBe('2024');
  // });
  // // NEED VALIDATION FOR FORMAT IN SAFE MODE
  // test('invalid dateformat', () => {
  //   const parser = new Parser('DATEFORMAT({Поле 1}, "YYYY")', fields);
  //   const js = parser.toJs(true);

  //   expect(() => parser.runJs(js, values)).toThrow();
  // });
  // test('dateparse', () => {
  //   const parser = new Parser('DATEPARSE("2012", "yyyy")', fields);
  //   const js = parser.toJs();

  //   expect(parser.runJs(js, values)).toBe('2012-01-01T00:00:00.000Z');
  // });
  // // NEED VALIDATION FOR FORMAT IN SAFE MODE
  // test('invalid format in dateparse', () => {
  //   const parser = new Parser('DATEPARSE("2012", "YYYY")', fields);
  //   const js = parser.toJs();

  //   expect(parser.runJs(js, values)).toBe('2012-01-01T00:00:00.000Z');
  // });
  test('YEAR', () => {
    const parser = new Parser('YEAR({Поле 1})', fields);
    const js = parser.toJs();

    expect(parser.runJs(js, values)).toBe(2024);
  });
  test('MONTH', () => {
    const parser = new Parser('MONTH({Поле 1})', fields);
    const js = parser.toJs();

    expect(parser.runJs(js, values)).toBe(1);
  });
  test('weekday', () => {
    const parser = new Parser('WEEKDAY({Поле 1})', fields);
    const js = parser.toJs();

    expect(parser.runJs(js, values)).toBe(1);
  });
  test('weekday saturday', () => {
    const parser = new Parser('WEEKDAY(DATEADD({Поле 1}, 6, "d"))', fields);
    const js = parser.toJs();

    expect(parser.runJs(js, values)).toBe(7);
  });
  test('weeknumber', () => {
    const parser = new Parser('WEEKNUM({Поле 1})', fields);
    const js = parser.toJs();

    expect(parser.runJs(js, values)).toBe(1);
  });
  test('day', () => {
    const parser = new Parser('DAY({Поле 1})', fields);
    const js = parser.toJs();

    expect(parser.runJs(js, values)).toBe(1);
  });
  test('HOUR', () => {
    const parser = new Parser('HOUR({Поле 1})', fields);
    const js = parser.toJs();

    expect(parser.runJs(js, values)).toBe(11);
  });
  test('MINUTE', () => {
    const parser = new Parser('MINUTE({Поле 1})', fields);
    const js = parser.toJs();

    expect(parser.runJs(js, values)).toBe(0);
  });
  test('SECOND', () => {
    const parser = new Parser('SECOND({Поле 1})', fields);
    const js = parser.toJs();

    expect(parser.runJs(js, values)).toBe(0);
  });

  // test('NOW', () => {
  //   const parser = new Parser('NOW()', fields);
  //   const js = parser.toJs();

  //   expect(typeof parser.runJs(js, values)).toBe('string');
  // });
  // test('TODAY', () => {
  //   const parser = new Parser('TODAY()', fields);
  //   const js = parser.toJs();

  //   expect(parser.runJs(js, values)).toBe(
  //     DateTime.now()
  //       .startOf('day')
  //       .toFormat('yyyy-LL-dd HH:mm:ssZZZ')
  //       .slice(0, -2),
  //   );
  // });
  test('DATE IN DATEADD', () => {
    const parser = new Parser('DATEADD(DATE(2001,12,12), 12, "d")', fields);
    const js = parser.toJs();

    expect(parser.runJs(js, values)).toBe('2001-12-24 00:00:00+03');
  });
});
