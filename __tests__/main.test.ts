import Parser from '../src/main';
import { IVar } from '../src/types';

const mockFields: Record<string, IVar> = {
  'Поле 1': {
    name: 'Поле 1',
    id: '3',
    type: 'number',
  },
  '9': {
    name: '9',
    id: '1',
    type: 'number',
  },
  FIELD123123: {
    name: 'FIELD123123',
    id: '2',
    type: 'number',
  },
};
const values: Record<string, unknown> = {
  'Поле 1': 1000,
  1: 1000,
  2: 2000,
  3: 1111,
  9: 1000,
  FIELD123123: 150,
};

describe('Parser', () => {
  const expression = '{9} + {FIELD123123} + 1000';

  test('should throw error if expression is nil', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => new Parser(null as any)).toThrow(
      'Missing required parameters: expression',
    );
  });

  test('should create AST and return it', () => {
    const parser = new Parser(expression, mockFields);
    const ast = parser.getAst();
    expect(ast).toBeDefined();
  });

  test('should extract variables from expression', () => {
    const parser = new Parser(expression, mockFields);
    const vars = parser.getVariables();
    expect(vars).toContain('9');
    expect(vars).toContain('FIELD123123');
  });

  test('should return used functions from expression', () => {
    const expression = 'CONCAT("test", 123, CONCAT(1)) + TO_STRING(123)';
    const parser = new Parser(expression, mockFields);
    const result = parser.getUsedFunctions();
    expect(result).toEqual(new Set(['CONCAT', 'TO_STRING']));
  });

  test('should map identifiers correctly', () => {
    const expression = '{Поле 1} + {Поле 1} + 1000';
    const parser = new Parser(expression, mockFields);
    const result = parser.mapIdentifiers({ to: 'id' });
    expect(typeof result).toBe('string');
  });

  test('should convert to SQL and JS', () => {
    const expression = '{Поле 1} + {Поле 1} + 1000';
    const parser = new Parser(expression, mockFields);
    const sql = parser.toSqlWithVariables(false, values);
    const js = parser.toJs();
    expect(typeof sql).toBe('string');
    expect(typeof js).toBe('string');
  });

  test('should evaluate JS expression with values', () => {
    const parser = new Parser(expression, mockFields);
    const js = parser.toJs();
    const result = parser.runJs(js, values);
    expect(typeof result).toBe('number');
  });

  test('should throw error if expression has some code strings.', () => {
    const parser = new Parser('"test" 123');
    expect(() => parser.toJs()).toThrow(`Invalid syntax at the position 7`);
  });

  test('variables should be changed after setting', () => {
    const parser = new Parser('{Поле 1}', mockFields);
    const first = parser.mapIdentifiers({ from: 'name', to: 'id' });

    parser.setVariables({
      'Поле 1': {
        name: 'Поле 1',
        id: '4',
        type: 'number',
      },
      '9': {
        name: '9',
        id: '1',
        type: 'number',
      },
      FIELD123123: {
        name: 'FIELD123123',
        id: '2',
        type: 'number',
      },
    });

    const second = parser.mapIdentifiers({ from: 'name', to: 'id' });

    expect(first).toBe('{3}');
    expect(second).toBe('{4}');
  });
});
