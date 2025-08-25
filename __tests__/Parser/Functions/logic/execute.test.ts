import { Parser } from '../../../../src';

describe('sql logic funcs', () => {
  test('isempty', () => {
    expect(new Parser('ISEMPTY(1)').toSqlWithVariables(true)).toBe(
      "((1) IS NULL OR (1)::TEXT = '')",
    );
  });
});
