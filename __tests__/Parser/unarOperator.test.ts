import { IField } from '../../src/main';
import { stringifyAstToJs } from '../helpers/stringifyAstToJs';
import { stringifyAstToSql } from '../helpers/stringifyAstToSql';

const fields: IField[] = [
  { id: '1', name: 'Поле 1', type: 'number' },
  { id: '2', name: 'Поле 2', type: 'number' },
  { id: '3', name: 'Поле 3', type: 'text' },
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

  // FIXME: TEMPEST COMMENT
  // test('minus can work with vars which type = number', () => {
  //   const code = '- {{2}}';
  //   const result = stringifyAstToSql(code, fields);

  //   expect(result).toBe(`- VARIABLES['2']`);
  // });
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
      'Unexpected type of data when - on the position 2',
    );
  });

  test('minus can’t work with vars which type = string', () => {
    const code = '- {{Поле 3}}';

    expect(() => stringifyAstToSql(code, fields)).toThrow(
      'Invalid variable {{Поле 3}} on the position 2',
    );
  });
});
