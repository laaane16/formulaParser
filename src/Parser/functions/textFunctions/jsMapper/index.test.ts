import { textFunctionsToJsMap } from '.';

describe('textFunctionsToJsMap', () => {
  test('CONCAT', () => {
    const result = textFunctionsToJsMap.CONCAT(['"Hello"', '" "', '"World"']);
    expect(result).toBe('"Hello" + " " + "World"');
  });

  test('TRIM both', () => {
    const result = textFunctionsToJsMap.TRIM(['"both"', '"x"', '"xxabcxx"']);
    expect(result).toBe(
      "\"xxabcxx\".replace(new RegExp('^(x)+|(x)+$', 'g'), '')",
    );
  });

  test('TRIM leading', () => {
    const result = textFunctionsToJsMap.TRIM(['"leading"', '"x"', '"xxabc"']);
    expect(result).toBe(
      "\"xxabc\".replace(new RegExp('^(x)+|(x)+$', 'g'), '')",
    );
  });

  test('TRIM trailing', () => {
    const result = textFunctionsToJsMap.TRIM(['"trailing"', '"x"', '"abcxx"']);
    expect(result).toBe(
      "\"abcxx\".replace(new RegExp('^(x)+|(x)+$', 'g'), '')",
    );
  });

  test('SEARCH', () => {
    const result = textFunctionsToJsMap.SEARCH(['"lo"', '"Hello"']);
    expect(result).toBe('"Hello".indexOf("lo") + 1');
  });

  test('REPLACE', () => {
    const result = textFunctionsToJsMap.REPLACE(['"banana"', '"a"', '"o"']);
    expect(result).toBe('"banana".replace(new RegExp(\'a\', \'g\'), "o")');
  });

  test('LOWER', () => {
    const result = textFunctionsToJsMap.LOWER(['"HELLO"']);
    expect(result).toBe('"HELLO".toLowerCase()');
  });

  test('UPPER', () => {
    const result = textFunctionsToJsMap.UPPER(['"hello"']);
    expect(result).toBe('"hello".toUpperCase()');
  });

  test('REPEAT', () => {
    const result = textFunctionsToJsMap.REPEAT(['"x"', '3']);
    expect(result).toBe('"x".repeat(3)');
  });

  test('SUBSTRING', () => {
    const result = textFunctionsToJsMap.SUBSTRING(['"abcdef"', '2', '3']);
    expect(result).toBe('"abcdef".slice(1, 1 + 3)');
  });

  test('LEFT', () => {
    const result = textFunctionsToJsMap.LEFT(['"abcdef"', '2']);
    expect(result).toBe('"abcdef".slice(0, 2)');
  });

  test('RIGHT', () => {
    const result = textFunctionsToJsMap.RIGHT(['"abcdef"', '3']);
    expect(result).toBe('"abcdef".slice(-3)');
  });

  test('LEN', () => {
    const result = textFunctionsToJsMap.LEN(['"hello"']);
    expect(result).toBe('"hello".length');
  });
});
