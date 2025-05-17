import { Parser } from '../../../src';

describe('boolean to sql', () => {
  test('true', () => {
    const parser = new Parser('true');

    expect(parser.toSql()).toBe('true');
  });
  test('false', () => {
    const parser = new Parser('false');

    expect(parser.toSql()).toBe('false');
  });
});
