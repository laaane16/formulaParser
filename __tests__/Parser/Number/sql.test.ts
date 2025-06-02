import { Parser } from '../../../src';

describe('number to sql', () => {
  test('float number', () => {
    const parser = new Parser('1.123');

    expect(parser.toSql()).toBe('1.123');
  });
  test('number', () => {
    const parser = new Parser('1');

    expect(parser.toSql()).toBe('1');
  });
  test('negative number', () => {
    const parser = new Parser('- 1');

    expect(parser.toSql()).toBe('(- 1)');
  });
});
