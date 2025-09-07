import { Parser } from '../../../../src';

describe('execute text funcs', () => {
  test('concat', () => {
    const parser = new Parser('CONCAT("HELLO", "_",  "WORLD")');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('HELLO_WORLD');
  });
  test('trim leading', () => {
    const parser = new Parser('TRIM("leading", "abc" , "ababcd")');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('d');
  });
  test('trim trailing', () => {
    const parser = new Parser('TRIM("trailing", "abc" , "qnabc")');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('qn');
  });
  test('trim both', () => {
    const parser = new Parser('TRIM("both", "abc" , "abcdabc")');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('d');
  });
  test('trim unknown value', () => {
    const parser = new Parser('TRIM("asdasdas", "abc" , "abcdabc")');
    const js = parser.toJs();

    expect(() => parser.runJs(js)).toThrow();
  });
  test('trim empty char', () => {
    const parser = new Parser('TRIM("both", "" , "abcdabc")');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('abcdabc');
  });
  test('safe trim leading', () => {
    const parser = new Parser('TRIM("leading", "abc" , "ababcd")');
    const js = parser.toJs(true);

    expect(parser.runJs(js)).toBe('d');
  });
  test('safe trim trailing', () => {
    const parser = new Parser('TRIM("trailing", "abc" , "qnabc")');
    const js = parser.toJs(true);

    expect(parser.runJs(js)).toBe('qn');
  });
  test('safe trim both', () => {
    const parser = new Parser('TRIM("both", "abc" , "abcdabc")');
    const js = parser.toJs(true);

    expect(parser.runJs(js)).toBe('d');
  });
  test('safe trim unknown position', () => {
    const parser = new Parser('TRIM("asdsad", "abc" , "abcdabc")');
    const js = parser.toJs(true);

    expect(parser.runJs(js)).toBe(null);
  });
  test('search', () => {
    const parser = new Parser('SEARCH("Hello", "lo")');
    const js = parser.toJs(true);

    expect(parser.runJs(js)).toBe(3);
  });
  test('search without occurrence', () => {
    const parser = new Parser('SEARCH("a", "Hello")');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe(-1);
  });
  test('replace', () => {
    const parser = new Parser('REPLACE("banana", "a", "o")');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('bonono');
  });
  test('replace empty', () => {
    const parser = new Parser('REPLACE("banana", "", "o")');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('banana');
  });
  test('lower', () => {
    const parser = new Parser('LOWER("BANANa")');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('banana');
  });
  test('upper', () => {
    const parser = new Parser('UPPER("BaNANa")');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('BANANA');
  });
  test('repeat', () => {
    const parser = new Parser('REPEAT("x", 3)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('xxx');
  });
  test('repeat with zero', () => {
    const parser = new Parser('REPEAT("x", 0)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('');
  });
  test('repeat with negative nums', () => {
    const parser = new Parser('REPEAT("x", -5)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('');
  });
  test('substring', () => {
    const parser = new Parser('SUBSTRING("abcdef", 2, 4)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('cdef');
  });
  test('substring with negative nums', () => {
    const parser = new Parser('SUBSTRING("str", -1, 3)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('');
  });
  test('substring with negative length', () => {
    const parser = new Parser('SUBSTRING("str", 2, -2)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('');
  });
  test('substring with negative all', () => {
    const parser = new Parser('SUBSTRING("str", -2, -2)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('');
  });
  test('left', () => {
    const parser = new Parser('LEFT("str", 2)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('st');
  });
  test('left with negative', () => {
    const parser = new Parser('LEFT("str", -2)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('');
  });
  test('right', () => {
    const parser = new Parser('RIGHT("str", 2)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('tr');
  });
  test('right with negative', () => {
    const parser = new Parser('RIGHT("str", -2)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('');
  });
  test('len', () => {
    const parser = new Parser('LEN("str")');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe(3);
  });
  // test('join with nums and strs', () => {
  //   const parser = new Parser('JOIN(",", "213", "test", 213)');
  //   const js = parser.toJs();

  //   expect(parser.runJs(js)).toBe('213,test,213');
  // });
  // test('join with nums and strs', () => {
  //   const parser = new Parser('JOIN(",", "213", "test", 213, 1 / 0)');
  //   const js = parser.toJs(true);

  //   expect(parser.runJs(js)).toBe('213,test,213');
  // });
  test('to string', () => {
    const parser = new Parser('TOSTRING(1)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('1');
  });
  test('to string with null', () => {
    const parser = new Parser('TOSTRING(1 / 0)');
    const js = parser.toJs(true);

    expect(parser.runJs(js)).toBe(null);
  });
  test('to string with str', () => {
    const parser = new Parser('TOSTRING("")');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('');
  });
  test('regex match', () => {
    const parser = new Parser('REGEXMATCH("Hello 1", "\\d")');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe(true);
  });
  test('regex match with incorrect mode', () => {
    const parser = new Parser('REGEXMATCH("Hello 1", "h", 2)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe(false);
  });
  test('regex match with correct mode', () => {
    const parser = new Parser('REGEXMATCH("Hello 1", "h", 1)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe(true);
  });
  test('regex replace', () => {
    const parser = new Parser('REGEXREPLACE("1 H 1", "\\d", "2")');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('2 H 1');
  });
  test('regex replace with incorrect mode', () => {
    const parser = new Parser('REGEXREPLACE("1 H 1", "\\d", "2", 2)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('2 H 1');
  });
  test('regex replace with correct mode', () => {
    const parser = new Parser('REGEXREPLACE("1 H 1", "\\d", "2", 1)');
    const js = parser.toJs();

    expect(parser.runJs(js)).toBe('2 H 2');
  });
});
