import { Parser } from '../../../src';

describe('special', () => {
  test('minus can work with many minuses', () => {
    const parser = new Parser('--- 2.234');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe(-2.234);
  });
});
