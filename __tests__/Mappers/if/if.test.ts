import { ifStatementMap } from '../../../src/Parser/mappers/if';

describe('toJs', () => {
  test('simple test', () => {
    const res = ifStatementMap.jsFn('2 > 1', '"test1"', '"test2"', 'String');
    expect(res).toBe(
      'String((function(){if (2 > 1){return "test1"}else{return "test2"}})())',
    );
  });
});

describe('toSql', () => {
  test('simple test', () => {
    const res = ifStatementMap.sqlFn('2 > 1', "'test1'", "'test2'", 'text');
    expect(res).toBe(
      `(CASE WHEN 2 > 1 THEN ('test1')::text ELSE ('test2')::text END)::text`,
    );
  });
});
