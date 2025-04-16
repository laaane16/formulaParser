import { ifStatementMap } from '.';

describe('toJs', () => {
  test('simple test', () => {
    const res = ifStatementMap.jsFn('2 > 1', '"test1"', '"test2"');
    expect(res).toBe(
      '(function(){if (2 > 1){return "test1"}else{return "test2"}})()',
    );
  });
});

describe('toSql', () => {
  test('simple test', () => {
    const res = ifStatementMap.sqlFn('2 > 1', "'test1'", "'test2'");
    expect(res).toBe(`CASE WHEN 2 > 1 THEN 'test1' ELSE 'test2' END`);
  });
});
