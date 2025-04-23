import Parser from '../src/main';
import { IVar } from '../src/main';

const mockFields: Record<string, IVar> = {
  'Поле 1': {
    id: '3',
    type: 'number',
  },
  '9': {
    id: '1',
    type: 'number',
  },
  FIELD123123: {
    id: '2',
    type: 'number',
  },
};
const values: Record<string, unknown> = {
  1: 1000,
  2: 2000,
  9: 1000,
  FIELD123123: 150,
};

describe('Parser', () => {
  const expression = '{{9}} + {{FIELD123123}} + 1000';

  it('should throw error if expression is nil', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => new Parser(null as any)).toThrow(
      'Missing required parameters: expression',
    );
  });

  it('should create AST and return it', () => {
    const parser = new Parser(expression, mockFields);
    const ast = parser.getAst();
    expect(ast).toBeDefined();
  });

  it('should extract variables from expression', () => {
    const parser = new Parser(expression, mockFields);
    const vars = parser.getVariables();
    expect(vars).toContain('9');
    expect(vars).toContain('FIELD123123');
  });

  it('should map identifiers correctly', () => {
    const expression = '{{Поле 1}} + {{Поле 1}} + 1000';
    const parser = new Parser(expression, mockFields);
    const result = parser.mapIdentifiers({ to: 'id' });
    expect(typeof result).toBe('string');
  });

  it('should convert to SQL and JS', () => {
    const expression = '{{Поле 1}} + {{Поле 1}} + 1000';
    const parser = new Parser(expression, mockFields);
    const sql = parser.toSql();
    const js = parser.toJs();
    expect(typeof sql).toBe('string');
    expect(typeof js).toBe('string');
  });

  it('should evaluate JS expression with values', () => {
    const parser = new Parser(expression, mockFields);
    const js = parser.toJs();
    const result = parser.runJs(js, values);
    expect(typeof result).toBe('number');
  });

  it('should replace variable placeholders with actual values', () => {
    const parser = new Parser(expression, mockFields);
    const sql = "$$VARIABLES['9'] + $$VARIABLES['FIELD123123']";
    const replaced = parser.replaceWithVariables(sql, values);
    expect(replaced).toBe('1000 + 150');
  });
});
