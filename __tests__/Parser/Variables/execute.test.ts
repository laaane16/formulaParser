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

const values = {
  1: 100,
  2: 100,
  3: 'test',
  4: '2012-12-12',
};

const nullValues = {
  1: null,
  2: null,
  3: null,
  4: null,
};

describe('variables execute', () => {
  test('num', () => {
    const parser = new Parser('{1}', fields);
    const js = parser.toJs();

    expect(parser.runJs(js, values)).toBe(100);
  });
  test('text', () => {
    const parser = new Parser('{3}', fields);
    const js = parser.toJs();

    expect(parser.runJs(js, values)).toBe('test');
  });
  test('date', () => {
    const parser = new Parser('{4}', fields);
    const js = parser.toJs();

    expect(parser.runJs(js, values)).toBe('2012-12-12');
  });

  test('num with null in value', () => {
    const parser = new Parser('{1}', fields);
    const js = parser.toJs();

    expect(parser.runJs(js, nullValues)).toBe(0);
  });
  test('text with null in value', () => {
    const parser = new Parser('{3}', fields);
    const js = parser.toJs();

    expect(parser.runJs(js, nullValues)).toBe('');
  });
  test('date with null in value', () => {
    const parser = new Parser('{4}', fields);
    const js = parser.toJs();

    expect(parser.runJs(js, nullValues)).toBe(null);
  });
});
