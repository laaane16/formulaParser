import { Parser } from '../../../src';

const fields = {
  '1': {
    id: '1',
    type: 'number',
  },
  '2': {
    id: '2',
    type: 'number',
  },
  '3': {
    id: '3',
    type: 'text',
  },
  '4': {
    id: '4',
    type: 'date',
  },
};

describe('variables to sql', () => {
  test('num', () => {
    const parser = new Parser('{1}', fields);
    expect(parser.toSql()).toBe(`COALESCE($$VARIABLES['1'], 0)`);
  });
  test('text', () => {
    const parser = new Parser('{3}', fields);
    expect(parser.toSql()).toBe(`COALESCE($$VARIABLES['3'], '')`);
  });
  test('date', () => {
    const parser = new Parser('{4}', fields);
    expect(parser.toSql()).toBe(`COALESCE($$VARIABLES['4'], NULL)`);
  });
});

describe('variables errors', () => {
  test('return error if we write no valid variable', () => {
    const parser = new Parser('{Поле 1}', fields);
    expect(() => parser.toSql()).toThrow();
  });
});
