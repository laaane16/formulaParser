import { Parser } from '../../../../src';

describe('js logic funcs', () => {
  test('isempty with num', () => {
    const parser = new Parser('ISEMPTY(1)');
    expect(parser.runJs(parser.toJs(true))).toBe(false);
  });

  test('isempty with str', () => {
    const parser = new Parser('ISEMPTY("test")');
    expect(parser.runJs(parser.toJs(true))).toBe(false);
  });

  test('isempty with empty str', () => {
    const parser = new Parser('ISEMPTY("")');
    expect(parser.runJs(parser.toJs(true))).toBe(true);
  });

  test('isempty with errors', () => {
    const parser = new Parser('ISEMPTY(1 / 0)');
    expect(parser.runJs(parser.toJs(true))).toBe(true);
  });
});
