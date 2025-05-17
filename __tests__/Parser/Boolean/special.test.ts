import { Parser } from '../../../src';

describe('boolean special tests', () => {
  test('operators which needed bool in operands', () => {
    const parser = new Parser('1 < 2 || true');

    expect(parser.toSql()).toBe('1 < 2 OR true');
  });
});
