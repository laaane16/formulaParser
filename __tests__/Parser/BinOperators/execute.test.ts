import { Parser } from '../../../src';

describe('Binary operators execute', () => {
  const variables = {
    field1: {
      id: '1',
      name: 'field1',
      type: 'number',
    },
    field2: {
      id: '1',
      name: 'field2',
      type: 'text',
    },
  };
  const values = {
    field1: null,
    field2: null,
  };

  // PLUS
  test('plus correct with nums', () => {
    const parser = new Parser('1 + 1');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(2);
  });
  test('plus correct with strs', () => {
    const parser = new Parser('"1" + "1"');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe('11');
  });
  test('plus correct with str and num', () => {
    const parser = new Parser('"1" + 1');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe('11');
  });
  test('plus with null in field and num', () => {
    const parser = new Parser('1 + {field1}', variables);
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula, values)).toBe(1);
  });
  test('plus with null in field and str', () => {
    const parser = new Parser('"" + {field2}', variables);
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula, values)).toBe('');
  });
  test('plus with null in field and null in field', () => {
    const parser = new Parser('{field1} + {field2}', variables);
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula, values)).toBe('0');
  });
  test('plus with number and null', () => {
    const parser = new Parser('1 + 1 / 0', variables);
    const jsFormula = parser.toJs(true);

    expect(parser.runJs(jsFormula, values)).toBe(null);
  });
  test('plus with str and null', () => {
    const parser = new Parser('"test" + 1 / 0', variables);
    const jsFormula = parser.toJs(true);

    expect(parser.runJs(jsFormula, values)).toBe('test');
  });

  // CONCATENATION
  test('concatenation correct with nums', () => {
    const parser = new Parser('1 & 1');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe('11');
  });
  test('concatenation correct with strs', () => {
    const parser = new Parser('"1" & "1"');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe('11');
  });
  test('concatenation correct with str and num', () => {
    const parser = new Parser('"1" & 1');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe('11');
  });
  test('concatenation with null in field and num', () => {
    const parser = new Parser('1 & {field1}', variables);
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula, values)).toBe('10');
  });
  test('concatenation with null in field and str', () => {
    const parser = new Parser('"" & {field2}', variables);
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula, values)).toBe('');
  });
  test('concatenation with null in field and null in field', () => {
    const parser = new Parser('{field1} & {field2}', variables);
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula, values)).toBe('0');
  });
  test('concatenation with number and null', () => {
    const parser = new Parser('1 & 1 / 0', variables);
    const jsFormula = parser.toJs(true);

    expect(parser.runJs(jsFormula, values)).toBe('1');
  });
  test('concatenation with str and null', () => {
    const parser = new Parser('"test" & 1 / 0', variables);
    const jsFormula = parser.toJs(true);

    expect(parser.runJs(jsFormula, values)).toBe('test');
  });

  // MINUS
  test('minus correct with nums', () => {
    const parser = new Parser('1 - 1');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(0);
  });
  test('minus correct with num and field null', () => {
    const parser = new Parser('1 - {field1}', variables);
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula, values)).toBe(1);
  });
  test('minus correct with num and null', () => {
    const parser = new Parser('1 - 1 / 0');
    const jsFormula = parser.toJs(true);

    expect(parser.runJs(jsFormula, values)).toBe(null);
  });

  // MULTIPLY
  test('multiply correct with nums', () => {
    const parser = new Parser('1 * 3');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(3);
  });
  test('multiply correct with num and field null', () => {
    const parser = new Parser('1 * {field1}', variables);
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula, values)).toBe(0);
  });
  test('multiply correct with num and null', () => {
    const parser = new Parser('1 * (1 / 0)');
    const jsFormula = parser.toJs(true);

    expect(parser.runJs(jsFormula, values)).toBe(null);
  });

  // DIVISION
  test('division correct with nums', () => {
    const parser = new Parser('10 / 2');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(5);
  });
  // test('division correct with nums, not an integer response', () => {
  //   const parser = new Parser('10 / 3');
  //   const jsFormula = parser.toJs();

  //   expect(parser.runJs(jsFormula)).toBe(3);
  // });
  test('division correct with zero', () => {
    const parser = new Parser('10 / 0');
    const jsFormula = parser.toJs(true);

    expect(parser.runJs(jsFormula, values)).toBe(null);
  });
  test('division correct with num and field null', () => {
    const parser = new Parser('10 / {field1}', variables);
    const jsFormula = parser.toJs(true);

    expect(parser.runJs(jsFormula, values)).toBe(null);
  });

  // REMAINDER
  test('remainder correct with nums', () => {
    const parser = new Parser('10 % 2');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(0);
  });
  test('remainder correct with negative nums', () => {
    const parser = new Parser('-10 % 3');
    const jsFormula = parser.toJs(true);

    expect(parser.runJs(jsFormula, values)).toBe(-1);
  });
  test('remainder correct with num and field null', () => {
    const parser = new Parser('10 % {field1}', variables);
    const jsFormula = parser.toJs(true);

    expect(parser.runJs(jsFormula, values)).toBe(null);
  });
  test('remainder correct with zero', () => {
    const parser = new Parser('10 % 0');
    const jsFormula = parser.toJs(true);

    expect(parser.runJs(jsFormula, values)).toBe(null);
  });

  // POWER
  test('power correct with nums', () => {
    const parser = new Parser('3 ^ 3');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(27);
  });
  test('power correct with num and negative degree', () => {
    const parser = new Parser('3 ^ -3', variables);
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula, values)).toBe(1 / 27);
  });

  // EQUAL
  test('equal correct with nums', () => {
    const parser = new Parser('10 == 10');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(true);
  });
  test('equal correct with strs', () => {
    const parser = new Parser('"asd" == "10"');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(false);
  });
  test('equal correct with num and str', () => {
    const parser = new Parser('"asd" == 10');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(false);
  });
  test('equal correct with num and str', () => {
    const parser = new Parser('"10" == 10');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(true);
  });
  test('equal correct with num and null', () => {
    const parser = new Parser('0 == 1 / 0');
    const jsFormula = parser.toJs(true);
    expect(parser.runJs(jsFormula, undefined)).toBe(null);
  });

  // NOT EQUAL
  test('not equal correct with nums', () => {
    const parser = new Parser('10 != 10');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(false);
  });
  test('not equal correct with strs', () => {
    const parser = new Parser('"asd" != "10"');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(true);
  });
  test('not equal correct with num and str', () => {
    const parser = new Parser('"asd" != 10');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(true);
  });
  test('not equal correct with num and str', () => {
    const parser = new Parser('"10" != 10');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(false);
  });

  // GREATER
  test('equal correct with nums', () => {
    const parser = new Parser('10 > 10');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(false);
  });
  test('equal correct with strs', () => {
    const parser = new Parser('"asd" > "10"');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(true);
  });
  test('equal correct with num and str', () => {
    const parser = new Parser('"asd" > 10');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(true);
  });
  test('equal correct with num and str', () => {
    const parser = new Parser('"10" > 10');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(false);
  });

  // GREATER OR EQUAL
  test('greater or equal correct with nums', () => {
    const parser = new Parser('10 >= 10');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(true);
  });
  test('greater or equal correct with strs', () => {
    const parser = new Parser('"asd" >= "10"');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(true);
  });
  test('greater or equal correct with num and str', () => {
    const parser = new Parser('"asd" >= 10');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(true);
  });
  test('greater or equal correct with num and str', () => {
    const parser = new Parser('"10" >= 10');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(true);
  });

  // LESS
  test('less correct with nums', () => {
    const parser = new Parser('10 < 10');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(false);
  });
  test('less correct with strs', () => {
    const parser = new Parser('"asd" < "10"');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(false);
  });
  test('less correct with num and str', () => {
    const parser = new Parser('"asd" < 10');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(false);
  });
  test('less correct with num and str', () => {
    const parser = new Parser('"10" < 10');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(false);
  });

  // LESS OR EQUAL
  test('less or equal correct with nums', () => {
    const parser = new Parser('10 <= 10');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(true);
  });
  test('less or equal correct with strs', () => {
    const parser = new Parser('"asd" <= "10"');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(false);
  });
  test('less or equal correct with num and str', () => {
    const parser = new Parser('"asd" <= 10');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(false);
  });
  test('less or equal correct with num and str', () => {
    const parser = new Parser('"10" <= 10');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(true);
  });

  // AND
  test('and car work with bool type', () => {
    const parser = new Parser('1 > 0 && 1 > 0');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(true);
  });
  test('and car work with bool type and null', () => {
    const parser = new Parser('1 > 0 && 1 > 1 / 0');
    const jsFormula = parser.toJs(true);

    expect(parser.runJs(jsFormula, undefined)).toBe(null);
  });

  // OR
  test('and car work with bool type', () => {
    const parser = new Parser('1 > 1 || 1 > 0');
    const jsFormula = parser.toJs();

    expect(parser.runJs(jsFormula)).toBe(true);
  });
  test('and car work with bool type and null', () => {
    const parser = new Parser('1 > 0 || 1 > 1 / 0');
    const jsFormula = parser.toJs(true);

    expect(parser.runJs(jsFormula, undefined)).toBe(null);
  });
});
