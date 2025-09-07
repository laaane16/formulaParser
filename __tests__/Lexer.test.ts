import Lexer from '../src/Lexer';

describe('Lexer', () => {
  test('должен токенизировать выражение с числами и операторами', () => {
    const lexer = new Lexer('3 + 5 * 2');
    const tokens = lexer.lexAnalysis();

    expect(tokens.map((t) => t.token.name)).toEqual([
      'NUMBER',
      'SPACE',
      'PLUS',
      'SPACE',
      'NUMBER',
      'SPACE',
      'MULTIPLY',
      'SPACE',
      'NUMBER',
    ]);
  });

  test('должен токенизировать строку', () => {
    const lexer = new Lexer('"hello"');
    const tokens = lexer.lexAnalysis();

    expect(tokens).toHaveLength(1);
    expect(tokens[0].token.name).toBe('STRING');
    expect(tokens[0].text).toBe('"hello"');
  });

  test('должен распознать переменную внутри двойных фигурных скобок', () => {
    const lexer = new Lexer('{username}');
    const tokens = lexer.lexAnalysis();

    expect(tokens).toHaveLength(1);
    expect(tokens[0].token.name).toBe('VARIABLE');
    expect(tokens[0].text).toBe('{username}');
  });

  test('должен различать логические значения true и false', () => {
    const lexer = new Lexer('true false');
    const tokens = lexer.lexAnalysis();

    expect(tokens.map((t) => t.token.name)).toEqual(['TRUE', 'SPACE', 'FALSE']);
  });

  test('должен распознать унарные и бинарные операторы', () => {
    const lexer = new Lexer('! - + * / % ^ == != > >= < <=');
    const tokens = lexer.lexAnalysis();

    expect(tokens.map((t) => t.token.name)).toEqual([
      'NOT',
      'SPACE',
      'MINUS',
      'SPACE',
      'PLUS',
      'SPACE',
      'MULTIPLY',
      'SPACE',
      'DIVISION',
      'SPACE',
      'REMAINDER',
      'SPACE',
      'POWER',
      'SPACE',
      'EQUAL',
      'SPACE',
      'NOTEQUAL',
      'SPACE',
      'GREATER',
      'SPACE',
      'GREATEROREQUAL',
      'SPACE',
      'LESS',
      'SPACE',
      'LESSOREQUAL',
    ]);
  });

  test('должен выбросить ошибку при нераспознанном символе', () => {
    const lexer = new Lexer('3 ? 4');
    expect(() => lexer.lexAnalysis()).toThrow();
  });

  test('должен игнорировать пробелы', () => {
    const lexer = new Lexer('   123    + 456 ');
    const tokens = lexer.lexAnalysis();

    expect(tokens.map((t) => t.token.name)).toEqual([
      'SPACE',
      'SPACE',
      'SPACE',
      'NUMBER',
      'SPACE',
      'SPACE',
      'SPACE',
      'SPACE',
      'PLUS',
      'SPACE',
      'NUMBER',
      'SPACE',
    ]);
  });

  test('должен токенизировать функцию и скобки', () => {
    const lexer = new Lexer('SUM(123,456)');
    const tokens = lexer.lexAnalysis();

    expect(tokens.map((t) => t.token.name)).toEqual([
      'FUNCTION',
      'LPAR',
      'NUMBER',
      'VIRGULE',
      'NUMBER',
      'RPAR',
    ]);
  });
});

describe('lexer analyze string', () => {
  test('two brackets', () => {
    const tokens = new Lexer('""').lexAnalysis();
    expect(tokens.map((t) => t.token.name)).toEqual(['STRING']);
  });

  test('one brackets', () => {
    const tokens = new Lexer(`''`).lexAnalysis();
    expect(tokens.map((t) => t.token.name)).toEqual(['STRING']);
  });

  test('nested brackets', () => {
    const tokens = new Lexer(`"'''''''test'" + '"" "'`).lexAnalysis();
    expect(tokens.map((t) => t.token.name)).toEqual([
      'STRING',
      'SPACE',
      'PLUS',
      'SPACE',
      'STRING',
    ]);
  });

  // test('Escaped quotes of the same type', () => {
  //   const tokens = new Lexer(`" \\" " + ' \\' '`).lexAnalysis();
  //   expect(tokens.map((t) => t.token.name)).toEqual([
  //     'STRING',
  //     'PLUS',
  //     'STRING',
  //   ]);
  // });

  // test('Mixed cases with shielding', () => {
  //   const tokens = new Lexer(
  //     `"123\\"\\"\\'\\'" + '123\\"\\"\\'\\'\\'' + "text with \\"quote\\" and 'single'"`,
  //   ).lexAnalysis();
  //   expect(tokens.map((t) => t.token.name)).toEqual([
  //     'STRING',
  //     'PLUS',
  //     'STRING',
  //     'PLUS',
  //     'STRING',
  //   ]);
  // });

  test('special symbols in strings', () => {
    const tokens = new Lexer(
      `"str with \t and \n " + '\\n \\t \\r \\f'`,
    ).lexAnalysis();
    expect(tokens.map((t) => t.token.name)).toEqual([
      'STRING',
      'SPACE',
      'PLUS',
      'SPACE',
      'STRING',
    ]);
  });

  test('Backslashed strings', () => {
    const tokens = new Lexer(`" \\\\" + '\\\\'`).lexAnalysis();
    expect(tokens.map((t) => t.token.name)).toEqual([
      'STRING',
      'SPACE',
      'PLUS',
      'SPACE',
      'STRING',
    ]);
  });

  // test('Complex cases with escaping quotes', () => {
  //   const tokens = new Lexer(`" \\"\\" \\\\"\\\\""`).lexAnalysis();
  //   expect(tokens.map((t) => t.token.name)).toEqual(['STRING']);
  // });

  test('Boundary and special cases', () => {
    expect(() => new Lexer(`"`).lexAnalysis()).toThrow();
  });
});
