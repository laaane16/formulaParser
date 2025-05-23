import { Parser } from '../../../src';

describe('variables execute', () => {
  test('if true in condition', () => {
    const parser = new Parser('IF(1 > 2, "test", 1)');
    expect(parser.toSql()).toBe(
      "(CASE WHEN 1 > 2 THEN 'test'::text ELSE 1::text END)",
    );
  });
  test('if false in condition', () => {
    const parser = new Parser('IF(1 < 2, "test", 1)');
    expect(parser.toSql()).toBe(
      "(CASE WHEN 1 < 2 THEN 'test'::text ELSE 1::text END)",
    );
  });
});
