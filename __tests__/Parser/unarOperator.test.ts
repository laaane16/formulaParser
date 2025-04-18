import { stringifyAstToJs } from '../helpers/stringifyAstToJs';
import { stringifyAstToSql } from '../helpers/stringifyAstToSql';

const fields = [
  { id: '1', title: 'Поле 1', type: 'number' },
  { id: '2', title: 'Поле 2', type: 'number' },
  { id: '3', title: 'Поле 3', type: 'text' },
];

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

  test('minus can work with vars which type = number', () => {
    const code = '- {{Поле 2}}';
    const result = stringifyAstToSql(code, fields);

    expect(result).toBe(`- {2}`);
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

describe('unar operator node errors', () => {
  test('minus can’t work with string', () => {
    const code = '- ""';

    expect(() => stringifyAstToSql(code)).toThrow(
      'Неожиданный тип данных при - на позиции 2',
    );
  });

  test('minus can’t work with vars which type = string', () => {
    const code = '- {{Поле 3}}';

    expect(() => stringifyAstToSql(code, fields)).toThrow(
      'Неожиданный тип данных при - на позиции 2',
    );
  });
});
