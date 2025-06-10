import { Parser } from '../../src';

describe('replaceWithVariables - validateReplacedVariables', () => {
  it('should throw if a variable is not in the values object', () => {
    const parser = new Parser('{1} + {2}', {
      1: { id: '1', type: 'number' },
      2: { id: '2', type: 'number' },
    });

    const sql = parser.toSql();

    expect(() => parser.replaceWithVariables(sql, { 1: 100 })).toThrow(
      'Missing variables in values 2',
    );
  });

  it('should replace variables correctly if all values are present', () => {
    const parser = new Parser('{1} + {2}', {
      1: { id: '1', type: 'number' },
      2: { id: '2', type: 'number' },
    });

    const sql = parser.toSql();
    const result = parser.replaceWithVariables(sql, { 1: 100, 2: 200 });

    expect(result).toBe('COALESCE(100, 0) + COALESCE(200, 0)');
  });

  it('should stringify string values when replacing', () => {
    const parser = new Parser('{1} + " test"', {
      1: { id: '1', type: 'text' },
    });

    const sql = parser.toSql();
    const result = parser.replaceWithVariables(sql, { 1: 'hello' });

    expect(result).toBe(`CONCAT(COALESCE("hello", ''), ' test')`);
  });
});
