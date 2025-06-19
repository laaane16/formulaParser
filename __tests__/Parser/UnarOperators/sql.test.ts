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
    const parser = new Parser('! 1 > 2');

    expect(parser.toSqlWithVariables()).toBe('(NOT 1 > 2)');
  });

  test('minus can work with number', () => {
    const parser = new Parser('- 2.234');

    expect(parser.toSqlWithVariables()).toBe(`(- 2.234)`);
  });

  test('minus can work with vars which type = number', () => {
    const parser = new Parser('- {Поле 2}', fields);

    expect(parser.toSqlWithVariables(false, values)).toBe(
      `(- COALESCE(100, 0))`,
    );
  });
});

describe('unar operator errors', () => {
  test('not can`t work with types different to bool', () => {
    const parser = new Parser('! 1');

    expect(() => parser.toSqlWithVariables()).toThrow();
  });
});
