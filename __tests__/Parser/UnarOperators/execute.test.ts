import { Parser } from '../../../src';
const fields = {
  'Поле 2': {
    id: '2',
    type: 'number',
  },
};

const values = {
  'Поле 2': 100,
};

describe('unar operator node to sql', () => {
  test('not', () => {
    const parser = new Parser('! 1 < 2');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe(false);
  });

  test('minus can work with number', () => {
    const parser = new Parser('- 2.234');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe(-2.234);
  });

  test('minus can work with vars which type = number', () => {
    const parser = new Parser('- {Поле 2}', fields);
    const js = parser.toJs();

    expect(parser.runJs(js, values)).toBe(-100);
  });
});
