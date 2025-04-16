import Lexer from '.';

describe('Lexer', () => {
  it('должен токенизировать выражение с числами и операторами', () => {
    const lexer = new Lexer('3 + 5 * 2');
    const tokens = lexer.lexAnalysis();

    expect(tokens.map((t) => t.token.name)).toEqual([
      'NUMBER',
      'PLUS',
      'NUMBER',
      'MULTIPLY',
      'NUMBER',
    ]);
  });

  it('должен токенизировать строку', () => {
    const lexer = new Lexer('"hello"');
    const tokens = lexer.lexAnalysis();

    expect(tokens).toHaveLength(1);
    expect(tokens[0].token.name).toBe('STRING');
    expect(tokens[0].text).toBe('"hello"');
  });

  it('должен распознать переменную внутри двойных фигурных скобок', () => {
    const lexer = new Lexer('{{username}}');
    const tokens = lexer.lexAnalysis();

    expect(tokens).toHaveLength(1);
    expect(tokens[0].token.name).toBe('VARIABLE');
    expect(tokens[0].text).toBe('{{username}}');
  });

  it('должен различать логические значения true и false', () => {
    const lexer = new Lexer('true false');
    const tokens = lexer.lexAnalysis();

    expect(tokens.map((t) => t.token.name)).toEqual(['TRUE', 'FALSE']);
  });

  it('должен распознать унарные и бинарные операторы', () => {
    const lexer = new Lexer('! - + * / % ^ == != > >= < <=');
    const tokens = lexer.lexAnalysis();

    expect(tokens.map((t) => t.token.name)).toEqual([
      'NOT',
      'MINUS',
      'PLUS',
      'MULTIPLY',
      'DIVISION',
      'REMAINDER',
      'POWER',
      'EQUAL',
      'NOT_EQUAL',
      'GREATER',
      'GREATER_OR_EQUAL',
      'LESS',
      'LESS_OR_EQUAL',
    ]);
  });

  it('должен выбросить ошибку при нераспознанном символе', () => {
    const lexer = new Lexer('3 & 4');
    expect(() => lexer.lexAnalysis()).toThrow('На позиции 2 обнаружена ошибка');
  });

  it('должен игнорировать пробелы', () => {
    const lexer = new Lexer('   123    + 456 ');
    const tokens = lexer.lexAnalysis();

    expect(tokens.map((t) => t.token.name)).toEqual([
      'NUMBER',
      'PLUS',
      'NUMBER',
    ]);
  });

  it('должен токенизировать функцию и скобки', () => {
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
