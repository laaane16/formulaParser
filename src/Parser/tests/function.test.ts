import { stringifyAstToSql } from './helpers/stringifyAstToSql';
import { stringifyAstToJs } from './helpers/stringifyAstToJs';

describe('function node to sql', () => {
  test('function CONCAT can work with string', () => {
    const code = 'CONCAT("test")';
    const result = stringifyAstToSql(code);

    expect(result).toBe("CONCAT('test')");
  });

  test('function CONCAT can work with many args which has type string', () => {
    const code = 'CONCAT("test", "test2", "test3")';
    const result = stringifyAstToSql(code);

    expect(result).toBe("CONCAT('test','test2','test3')");
  });

  test(`function CONCAT can work with string`, () => {
    //  case: CONCAT(CONCAT("1"), CONCAT("2")), funcs in args returns strings

    const code = `CONCAT(CONCAT("1"), CONCAT("2"))`;

    const result = stringifyAstToSql(code);
    expect(result).toBe("CONCAT(CONCAT('1'),CONCAT('2'))");
  });

  test(`function CONCAT can work with string`, () => {
    // case: CONCAT(CONCAT(CONCAT(CONCAT(CONCAT("2"))))), func should can work with high nesting funcs in args
    const code = `CONCAT(CONCAT(CONCAT(CONCAT(CONCAT("2")))))`;

    const result = stringifyAstToSql(code);
    expect(result).toBe("CONCAT(CONCAT(CONCAT(CONCAT(CONCAT('2')))))");
  });

  test(`function CONCAT can work with number`, () => {
    const code = `CONCAT(1)`;

    const result = stringifyAstToSql(code);
    expect(result).toBe('CONCAT(1)');
  });

  test(`function CONCAT can work with number and string`, () => {
    const code = `CONCAT(1, "")`;

    const result = stringifyAstToSql(code);
    expect(result).toBe("CONCAT(1,'')");
  });

  test(`function CONCAT can work with number and string`, () => {
    const code = `CONCAT(RANDOM(), CONCAT("", 1))`;

    const result = stringifyAstToSql(code);
    expect(result).toBe("CONCAT(RANDOM(),CONCAT('',1))");
  });

  test(`function CONCAT can work with expression in args`, () => {
    const code = `CONCAT(1 + 1)`;

    const result = stringifyAstToSql(code);
    expect(result).toBe('CONCAT(1 + 1)');
  });

  test(`function CONCAT can work with expression in args`, () => {
    const code = `CONCAT(CONCAT("", "test") + CONCAT("", 1, 2))`;

    const result = stringifyAstToSql(code);
    expect(result).toBe("CONCAT(CONCAT('','test') + CONCAT('',1,2))");
  });

  test(`function CONCAT can work with parenthsized expression in args`, () => {
    const code = `CONCAT((1 + 1 + 1 + RANDOM()), CONCAT("", 1, 2, "test"), (RANDOM() + RANDOM()))`;

    const result = stringifyAstToSql(code);
    expect(result).toBe(
      "CONCAT((1 + 1 + 1 + RANDOM()),CONCAT('',1,2,'test'),(RANDOM() + RANDOM()))",
    );
  });

  test('function RANDOM can be without params', () => {
    const code = 'RANDOM()';
    const result = stringifyAstToSql(code);

    expect(result).toBe('RANDOM()');
  });
});

describe('function node to js', () => {
  test('function CONCAT can work with string', () => {
    const code = 'CONCAT("test")';
    const result = stringifyAstToJs(code);

    expect(result).toBe('"test"');
  });

  test('function CONCAT can work with many args which has type string', () => {
    const code = 'CONCAT("test", "test2", "test3")';
    const result = stringifyAstToJs(code);

    expect(result).toBe('"test" + "test2" + "test3"');
  });

  test(`function CONCAT can work with string`, () => {
    //  case: CONCAT(CONCAT("1"), CONCAT("2")), funcs in args returns strings

    const code = `CONCAT(CONCAT("1"), CONCAT("2"))`;

    const result = stringifyAstToJs(code);
    expect(result).toBe('"1" + "2"');
  });

  test(`function CONCAT can work with string`, () => {
    // case: CONCAT(CONCAT(CONCAT(CONCAT(CONCAT("2"))))), func should can work with high nesting funcs in args
    const code = `CONCAT(CONCAT(CONCAT(CONCAT(CONCAT("2")))))`;

    const result = stringifyAstToJs(code);
    expect(result).toBe('"2"');
  });

  test(`function CONCAT can work with number`, () => {
    const code = `CONCAT(1)`;

    const result = stringifyAstToJs(code);
    expect(result).toBe('1');
  });

  test(`function CONCAT can work with number and string`, () => {
    const code = `CONCAT(1, "")`;

    const result = stringifyAstToJs(code);
    expect(result).toBe('1 + ""');
  });

  test(`function CONCAT can work with number and string`, () => {
    const code = `CONCAT(RANDOM(), CONCAT("", 1))`;

    const result = stringifyAstToJs(code);
    expect(result).toBe('Math.random() + "" + 1');
  });

  test(`function CONCAT can work with expression in args`, () => {
    const code = `1 + 1`;

    const result = stringifyAstToJs(code);
    expect(result).toBe('1 + 1');
  });

  test(`function CONCAT can work with expression in args`, () => {
    const code = `CONCAT(CONCAT("", "test") + CONCAT("", 1, 2))`;

    const result = stringifyAstToJs(code);
    expect(result).toBe('"" + "test" + "" + 1 + 2');
  });

  test(`function CONCAT can work with parenthsized expression in args`, () => {
    const code = `CONCAT((1 + 1 + 1 + RANDOM()), CONCAT("", 1, 2, "test"), (RANDOM() + RANDOM()))`;

    const result = stringifyAstToJs(code);
    expect(result).toBe(
      '(1 + 1 + 1 + Math.random()) + "" + 1 + 2 + "test" + (Math.random() + Math.random())',
    );
  });
});

describe('function node errors', () => {
  test('function TESTFUNC don`t support', () => {
    const code = `TESTFUNC()`;

    try {
      const result = stringifyAstToSql(code);
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
      const result = stringifyAstToSql(code);
      throw new Error('Должна быть ошибка');
    } catch (e: unknown) {
      expect(e).toBeInstanceOf(Error);

      expect((e as Error).message).toBe(
        'В функцию CONCAT на позиции 0 нужно добавить аргумент типа text,number',
      );
    }
  });

  test('function CONCAT can`t work with many args which not all has type string or num', () => {
    const code = 'CONCAT("test", "test2", true)';

    try {
      const result = stringifyAstToSql(code);
      throw new Error('Должна быть ошибка');
    } catch (e: unknown) {
      expect(e).toBeInstanceOf(Error);

      expect((e as Error).message).toBe(
        'Неожиданный тип данных KeywordNode в функции CONCAT на позиции 25',
      );
    }
  });

  test('function CONCAT can`t work with keyword', () => {
    const code = `CONCAT(false)`;

    try {
      const result = stringifyAstToSql(code);
      throw new Error('Должна быть ошибка');
    } catch (e: unknown) {
      expect(e).toBeInstanceOf(Error);

      expect((e as Error).message).toBe(
        'Неожиданный тип данных KeywordNode в функции CONCAT на позиции 8',
      );
    }
  });

  test(`function CONCAT can't work with expression which return unknown type in args`, () => {
    const code = 'CONCAT(1 + "")';

    try {
      const result = stringifyAstToSql(code);
      throw new Error('Должна быть ошибка');
    } catch (e: unknown) {
      expect(e).toBeInstanceOf(Error);

      expect((e as Error).message).toBe(
        'Неожиданный тип данных при + на позиции 11',
      );
    }
  });

  test(`function CONCAT can't work with parenthsized expression in args which has errors`, () => {
    const code = `CONCAT((1 + 1 + 1 + RANDOM()), CONCAT("", 1, 2, "test"), (RANDOM() + RANDOM() + ""))`;

    try {
      const result = stringifyAstToSql(code);
      throw new Error('Должна быть ошибка');
    } catch (e: unknown) {
      expect(e).toBeInstanceOf(Error);

      expect((e as Error).message).toBe(
        'Неожиданный тип данных при + на позиции 69',
      );
    }
  });

  test(`func should can work with high nesting funcs in args, but if the chain somewhere returns the wrong type we interrupt it`, () => {
    const code = `CONCAT(CONCAT(CONCAT(RANDOM(CONCAT("2")))))`;

    try {
      const result = stringifyAstToSql(code);
      throw new Error('Должна быть ошибка');
    } catch (e: unknown) {
      expect(e).toBeInstanceOf(Error);

      expect((e as Error).message).toBe(
        'Функция RANDOM не принимает никаких аргументов на позиции 28',
      );
    }
  });

  test('function RANDOM can`t be with params', () => {
    const code = 'RANDOM(1)';

    try {
      const result = stringifyAstToSql(code);
      throw new Error('Должна быть ошибка');
    } catch (e: unknown) {
      expect(e).toBeInstanceOf(Error);

      expect((e as Error).message).toBe(
        'Функция RANDOM не принимает никаких аргументов на позиции 7',
      );
    }
  });
});
