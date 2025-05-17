import { Parser } from '../../../src';

describe('boolean execute', () => {
  test('true', () => {
    const parser = new Parser('true');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(true);
  });
  test('false', () => {
    const parser = new Parser('false');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(false);
  });
});
