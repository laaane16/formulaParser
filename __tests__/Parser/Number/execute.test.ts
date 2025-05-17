import { Parser } from '../../../src';

describe('number execute', () => {
  test('number float', () => {
    const parser = new Parser('1.123');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(1.123);
  });
  test('number', () => {
    const parser = new Parser('1');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(1);
  });
  test('negative number', () => {
    const parser = new Parser('- 1');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(-1);
  });
});
