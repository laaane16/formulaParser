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

const parseToSql = (code: string): string => {
  const lexer = new Lexer(code);
  lexer.lexAnalysis();

  const parser = new Parser(lexer.tokens);
  parser.initVars(prepareFields);
  const node = parser.parseCode();

  const result = parser.toSql(node)[0];

  return result;
};

describe('number node', () => {
  test('natural number', () => {
    const code = '10001';
    const result = parseToSql(code);

    expect(result).toBe('10001');
  });

  test('float number', () => {
    const code = '1.123';
    const result = parseToSql(code);

    expect(result).toBe('1.123');
  });
});

describe('literal node', () => {
  test('empty string', () => {
    const code = '""';
    const result = parseToSql(code);

    expect(result).toBe('""');
  });

  test('string', () => {
    const code = '"/qw.e`Ё{{}}"';
    const result = parseToSql(code);

    expect(result).toBe('"/qw.e`Ё{{}}"');
  });
});

describe('keyword node', () => {
  test('true', () => {
    const code = 'true';
    const result = parseToSql(code);

    expect(result).toBe('true');
  });

  test('false', () => {
    const code = 'false';
    const result = parseToSql(code);

    expect(result).toBe('false');
  });
});

describe('bin operator node', () => {
  test('plus', () => {
    const code = '1 + 1';
    const result = parseToSql(code);

    expect(result).toBe('1 + 1');
  });

  test('minus', () => {
    const code = '1 - 1';
    const result = parseToSql(code);

    expect(result).toBe('1 - 1');
  });

  test('multiply', () => {
    const code = '1 * 1';
    const result = parseToSql(code);

    expect(result).toBe('1 * 1');
  });

  test('division', () => {
    const code = '1 / 1';
    const result = parseToSql(code);

    expect(result).toBe('1 / 1');
  });

  test('remainder', () => {
    const code = '1 % 1';
    const result = parseToSql(code);

    expect(result).toBe('1 % 1');
  });

  test('power', () => {
    const code = '1 ^ 1';
    const result = parseToSql(code);

    expect(result).toBe('1 ^ 1');
  });

  test('equal', () => {
    const code = '1 == 1';
    const result = parseToSql(code);

    expect(result).toBe('1 = 1');
  });

  test('not equal', () => {
    const code = '1 != 1';
    const result = parseToSql(code);

    expect(result).toBe('1 != 1');
  });

  test('greater', () => {
    const code = '1 > 1';
    const result = parseToSql(code);

    expect(result).toBe('1 > 1');
  });

  test('greater or equal', () => {
    const code = '1 >= 1';
    const result = parseToSql(code);

    expect(result).toBe('1 >= 1');
  });

  test('less', () => {
    const code = '1 < 1';
    const result = parseToSql(code);

    expect(result).toBe('1 < 1');
  });

  test('less or equal', () => {
    const code = '1 <= 1';
    const result = parseToSql(code);

    expect(result).toBe('1 <= 1');
  });

  test('and', () => {
    const code = '1 && 1';
    const result = parseToSql(code);

    expect(result).toBe('1 AND 1');
  });

  test('or', () => {
    const code = '1 || 1';
    const result = parseToSql(code);

    expect(result).toBe('1 OR 1');
  });
});

describe('unar operator node', () => {
  test('not', () => {
    const code = '!1';
    const result = parseToSql(code);

    expect(result).toBe('!1');
  });
});

describe('function node', () => {
  test('function TESTFUNC don`t support', () => {
    const code = `TESTFUNC()`;

    try {
      const result = parseToSql(code);
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

    try {
      const result = parseToSql(code);
      throw new Error('Должна быть ошибка');
    } catch (e: unknown) {
      expect(e).toBeInstanceOf(Error);

      expect((e as Error).message).toBe(
        'В функцию CONCAT на позиции 0 нужно добавить аргумент типа text',
      );
    }
  });

  test('function CONCAT can work with string', () => {
    const code = 'CONCAT("test")';
    const result = parseToSql(code);

    expect(result).toBe('CONCAT("test")');
  });

  test('function CONCAT can work with many args which has type string', () => {
    const code = 'CONCAT("test", "test2", "test3")';
    const result = parseToSql(code);

    expect(result).toBe('CONCAT("test","test2","test3")');
  });

  test('function CONCAT can`t work with many args which not all has type string', () => {
    const code = 'CONCAT("test", "test2", 1)';

    try {
      const result = parseToSql(code);
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

    try {
      const result = parseToSql(code);
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
    const result = parseToSql(code);

    expect(result).toBe('RANDOM()');
  });
});
