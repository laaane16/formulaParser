import { Parser } from '../../src';

describe('execute bin operators', () => {
  test('plus with two vars which one var equal null should return next var', () => {
    const parser = new Parser('{{Цена 1}} + {{Цена 2}}', {
      'Цена 1': { type: 'number' },
      'Цена 2': { type: 'number' },
    });

    const formula = parser.toJs();

    expect(parser.runJs(formula, { 'Цена 1': null, 'Цена 2': 300 })).toBe(300);
  });

  test('multiply with two vars which one var equal null should return next var', () => {
    const parser = new Parser('{{Цена}} * {{Кол-во}}', {
      Цена: { type: 'number' },
      'Кол-во': { type: 'number' },
    });

    const formula = parser.toJs();

    expect(parser.runJs(formula, { Цена: 300, 'Кол-во': null })).toBe(0);
  });
});
