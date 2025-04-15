import { stringifyAstToJs } from './helpers/stringifyAstToJs';
import { stringifyAstToSql } from './helpers/stringifyAstToSql';

describe('unar operator node to sql', () => {
  test('not', () => {
    const code = '!1';
    const result = stringifyAstToSql(code);

    expect(result).toBe('NOT 1');
  });

  test('not can work with all types', () => {
    const code = '! ""';
    const result = stringifyAstToSql(code);

    expect(result).toBe(`NOT ''`);
  });

  test('minus can work with number', () => {
    const code = '- 2.234';
    const result = stringifyAstToSql(code);

    expect(result).toBe(`- 2.234`);
  });
});

describe('unar operator node to js', () => {
  test('not', () => {
    const code = '!1';
    const result = stringifyAstToJs(code);

    expect(result).toBe(`! 1`);
  });

  test('not can work with all types', () => {
    const code = '! ""';
    const result = stringifyAstToJs(code);

    expect(result).toBe(`! ""`);
  });
});

describe('unar operator node errros', () => {
  test('minus can`t work with string', () => {
    const code = '- ""';
    try {
      const result = stringifyAstToSql(code);
      throw new Error('Должна быть ошибка');
    } catch (e) {
      expect(e).toBeInstanceOf(Error);

      expect((e as Error).message).toBe(
        'Неожиданный тип данных при - на позиции 2',
      );
    }
  });
});
