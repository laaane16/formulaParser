import Parser from '../src/main';
import { IField } from '../src/main';

const mockFields: IField[] = [
  { id: '1', dbId: 1, name: 'Поле 1', type: 'number' },
  { id: '2', dbId: 2, name: 'Поле 2', type: 'number' },
  { id: '9', dbId: 4, name: 'Поле 4', type: 'number' },
  { id: 'FIELD123123', dbId: 8, name: 'Поле 5', type: 'number' },
];

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
    const expression = '{{1}} + {{2}} + 1000';
    const parser = new Parser(expression, mockFields, 'dbId');
    const result = parser.mapIdentifiers({ from: 'dbId', to: 'id' });
    expect(typeof result).toBe('string');
  });

  it('should convert to SQL and JS', () => {
    const expression = '{{1}} + {{2}} + 1000';
    const parser = new Parser(expression, mockFields, 'dbId');
    const sql = parser.toSql();
    const js = parser.toJs();
    expect(typeof sql).toBe('string');
    expect(typeof js).toBe('string');
  });

  it('should evaluate JS expression with values', () => {
    const parser = new Parser(expression, mockFields, 'id');
    const js = parser.toJs();
    const result = parser.runJs(js, values);
    expect(typeof result).toBe('number');
  });

  it('should replace variable placeholders with actual values', () => {
    const parser = new Parser(expression, mockFields, 'id');
    const sql = "$$VARIABLES['9'] + $$VARIABLES['FIELD123123']";
    const replaced = parser.replaceWithVariables(sql, values);
    expect(replaced).toBe('1000 + 150');
  });
});
