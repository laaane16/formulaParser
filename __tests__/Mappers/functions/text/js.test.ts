import { textFunctionsToJsMap } from '../../../../src/Parser/mappers/functions/textFunctions/js';

describe('textFunctionsToJsMap', () => {
  test('CONCAT', () => {
    const result = textFunctionsToJsMap.CONCAT(['"Hello"', '" "', '"World"']);
    expect(result).toBe(
      '["Hello"," ","World"].filter(v => v).reduce((accum, i) => accum + String(i), "")',
    );
  });

  test('TRIM both', () => {
    const result = textFunctionsToJsMap.TRIM(["'both'", "'x'", "'xxabcxx'"]);
    expect(result).toBe(
      `(function(){
      const pattern = ('x').replace(/[.*+?^$}{()|[\\]]/g, '\\\\$&');
      if (('both') === 'leading') {
        return ('xxabcxx').replace(new RegExp('^[' + pattern + ']+'), '');
      } else if (('both') === 'trailing') {
        return ('xxabcxx').replace(new RegExp('[' + pattern + ']+$'), '');
      } else if (('both') === 'both') {
        return ('xxabcxx').replace(new RegExp('^[' + pattern + ']+|[' + pattern + ']+$', 'g'), '');
      }
      throw '';
    })()`,
    );
  });

  test('TRIM leading', () => {
    const result = textFunctionsToJsMap.TRIM(["'leading'", "'x'", "'abcxx'"]);
    expect(result).toBe(`(function(){
      const pattern = ('x').replace(/[.*+?^$}{()|[\\]]/g, '\\\\$&');
      if (('leading') === 'leading') {
        return ('abcxx').replace(new RegExp('^[' + pattern + ']+'), '');
      } else if (('leading') === 'trailing') {
        return ('abcxx').replace(new RegExp('[' + pattern + ']+$'), '');
      } else if (('leading') === 'both') {
        return ('abcxx').replace(new RegExp('^[' + pattern + ']+|[' + pattern + ']+$', 'g'), '');
      }
      throw '';
    })()`);
  });

  test('TRIM trailing', () => {
    const result = textFunctionsToJsMap.TRIM(["'trailing'", "'x'", "'abcxx'"]);
    expect(result).toBe(`(function(){
      const pattern = ('x').replace(/[.*+?^$}{()|[\\]]/g, '\\\\$&');
      if (('trailing') === 'leading') {
        return ('abcxx').replace(new RegExp('^[' + pattern + ']+'), '');
      } else if (('trailing') === 'trailing') {
        return ('abcxx').replace(new RegExp('[' + pattern + ']+$'), '');
      } else if (('trailing') === 'both') {
        return ('abcxx').replace(new RegExp('^[' + pattern + ']+|[' + pattern + ']+$', 'g'), '');
      }
      throw '';
    })()`);
  });

  test('SEARCH', () => {
    const result = textFunctionsToJsMap.SEARCH(['"lo"', '"Hello"']);
    expect(result).toBe('(("Hello").indexOf("lo") + 1)');
  });

  test('REPLACE', () => {
    const result = textFunctionsToJsMap.REPLACE(['"banana"', '"a"', '"o"']);
    expect(result).toBe(
      `(("a").length > 0 ? ("banana").replace(new RegExp(("a").replace(/[.*+?^$}{()|[\\]]/g, '\\\\$&'), 'g'), "o") : "banana")`,
    );
  });

  test('LOWER', () => {
    const result = textFunctionsToJsMap.LOWER(['"HELLO"']);
    expect(result).toBe('("HELLO").toLowerCase()');
  });

  test('UPPER', () => {
    const result = textFunctionsToJsMap.UPPER(['"hello"']);
    expect(result).toBe('("hello").toUpperCase()');
  });

  test('REPEAT', () => {
    const result = textFunctionsToJsMap.REPEAT(['"x"', '3']);
    expect(result).toBe(`((3) >= 0 ? ("x").repeat(3) : '')`);
  });

  test('SUBSTRING', () => {
    const result = textFunctionsToJsMap.SUBSTRING(['"abcdef"', '2', '3']);
    expect(result).toBe(
      `(("abcdef").slice((2) > 0 ? (2) - 1 : 0, (2) > 0 && (3) > 0? (2) +  (3) - 1 : 0))`,
    );
  });

  test('LEFT', () => {
    const result = textFunctionsToJsMap.LEFT(['"abcdef"', '2']);
    expect(result).toBe(`("abcdef").slice(0, (2) > 0 ? (2) : 0)`);
  });

  test('RIGHT', () => {
    const result = textFunctionsToJsMap.RIGHT(['"abcdef"', '3']);
    expect(result).toBe(
      '("abcdef").slice((3) > 0 ? (3) * (-1): ("abcdef").length)',
    );
  });

  test('LEN', () => {
    const result = textFunctionsToJsMap.LEN(['"hello"']);
    expect(result).toBe('("hello").length');
  });

  // test('JOIN', () => {
  //   const result = textFunctionsToJsMap.JOIN(['","', '1', '"1"']);
  //   expect(result).toBe('[1,"1"].filter(v => v).join(",")');
  // });

  test('TOSTRING', () => {
    const result = textFunctionsToJsMap.TOSTRING(['1']);
    expect(result).toBe('String(1)');
  });
});
