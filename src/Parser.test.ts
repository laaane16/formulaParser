import Lexer from './Lexer';
import Parser from './Parser';

const PREFIX = '{{';
const POSTFIX = '}}';

interface IField {
  id: string;
  title: string;
  type: string;
}

const fields: IField[] = [
  { id: '1', title: 'Поле 1', type: 'number' },
  { id: '2', title: 'Поле 2', type: 'number' },
  { id: '3', title: 'Поле 3', type: 'text' },
];

const prepareFields = fields.map((field) => ({
  title: `${PREFIX}${field.title}${POSTFIX}`,
  value: field.id,
  type: field.type,
}));

describe('bin operator node', () => {
  test('plus', () => {
    const code = '1 + 1';

    const lexer = new Lexer(code);
    lexer.lexAnalysis();

    const parser = new Parser(lexer.tokens);
    parser.initVars(prepareFields);
    const node = parser.parseCode();

    const result = parser.toSql(node)[0];

    expect(result).toBe('1+1');
  });
});

describe('function node', () => {
  test('function TESTFUNC don`t support', () => {
    const code = `TESTFUNC()`;

    const lexer = new Lexer(code);
    lexer.lexAnalysis();
    const parser = new Parser(lexer.tokens);
    parser.initVars(prepareFields);
    const node = parser.parseCode();
    try {
      const result = parser.toSql(node)[0];
      throw new Error('Должна быть ошибка');
    } catch (e: unknown) {
      expect(e).toBeInstanceOf(Error);

      expect((e as Error).message).toBe(
        'Недопустимое имя функции TESTFUNC на позиции 0',
      );
    }
  });

  test('function CONCAT can`t be without params', () => {
    const code = `CONCAT()`;

    const lexer = new Lexer(code);
    lexer.lexAnalysis();

    const parser = new Parser(lexer.tokens);
    parser.initVars(prepareFields);
    const node = parser.parseCode();

    try {
      const result = parser.toSql(node)[0];
      throw new Error('Должна быть ошибка');
    } catch (e: unknown) {
      expect(e).toBeInstanceOf(Error);

      expect((e as Error).message).toBe(
        'Функция CONCAT на позиции 0 не принимает никаких параметров',
      );
    }
  });

  test('function CONCAT can work with string', () => {
    const code = 'CONCAT("test")';

    const lexer = new Lexer(code);
    lexer.lexAnalysis();

    const parser = new Parser(lexer.tokens);
    parser.initVars(prepareFields);
    const node = parser.parseCode();

    const result = parser.toSql(node)[0];

    expect(result).toBe('CONCAT("test")');
  });

  test('function CONCAT can work with many args which has type string', () => {
    const code = 'CONCAT("test", "test2", "test3")';

    const lexer = new Lexer(code);
    lexer.lexAnalysis();

    const parser = new Parser(lexer.tokens);
    parser.initVars(prepareFields);
    const node = parser.parseCode();

    const result = parser.toSql(node)[0];

    expect(result).toBe('CONCAT("test","test2","test3")');
  });

  test('function CONCAT can`t work with many args which not all has type string', () => {
    const code = 'CONCAT("test", "test2", 1)';

    const lexer = new Lexer(code);
    lexer.lexAnalysis();

    const parser = new Parser(lexer.tokens);
    parser.initVars(prepareFields);
    const node = parser.parseCode();

    try {
      const result = parser.toSql(node)[0];
      throw new Error('Должна быть ошибка');
    } catch (e: unknown) {
      expect(e).toBeInstanceOf(Error);

      expect((e as Error).message).toBe(
        'Неожиданный тип данных number в функции CONCAT на позиции 25',
      );
    }
  });

  test('function CONCAT can`t work with number', () => {
    const code = `CONCAT(1)`;

    const lexer = new Lexer(code);

    lexer.lexAnalysis();

    const parser = new Parser(lexer.tokens);
    parser.initVars(prepareFields);

    const node = parser.parseCode();
    try {
      const result = parser.toSql(node)[0];
      throw new Error('Должна быть ошибка');
    } catch (e: unknown) {
      expect(e).toBeInstanceOf(Error);

      expect((e as Error).message).toBe(
        'Неожиданный тип данных number в функции CONCAT на позиции 8',
      );
    }
  });

  test('function RANDOM can be without params', () => {
    const code = 'RANDOM()';

    const lexer = new Lexer(code);
    lexer.lexAnalysis();

    const parser = new Parser(lexer.tokens);
    parser.initVars(prepareFields);
    const node = parser.parseCode();

    const result = parser.toSql(node)[0];

    expect(result).toBe('RANDOM()');
  });
});
