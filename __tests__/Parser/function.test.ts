import { stringifyAstToSql } from '../helpers/stringifyAstToSql';

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

  test('function TOSTRING can work with any types', () => {
    const code = 'TO_STRING("test")';
    const result = stringifyAstToSql(code);

    expect(result).toBe(`('test')::text`);
  });

  test('function TOSTRING can work with any types', () => {
    const code = 'TO_STRING(true)';
    const result = stringifyAstToSql(code);

    expect(result).toBe(`(true)::text`);
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
    expect(result).toBe("CONCAT(CONCAT(CONCAT('','test'), CONCAT('',1,2)))");
  });

  test(`function CONCAT can work with parenthsized expression in args`, () => {
    const code = `CONCAT((1 + 1 + 1 + RANDOM()), CONCAT("", 1, 2, "test"), (RANDOM() + RANDOM()))`;

    const result = stringifyAstToSql(code);
    expect(result).toBe(
      "CONCAT((1 + 1 + 1 + RANDOM()),CONCAT('',1,2,'test'),(RANDOM() + RANDOM()))",
    );
  });

  test('function CONCAT can work with negative num', () => {
    const code = `CONCAT(- 1 - 1)`;

    const result = stringifyAstToSql(code);
    expect(result).toBe('CONCAT((- 1 - 1))');
  });

  test('function CONCAT can work with negative num', () => {
    const code = `CONCAT(- (1 - 1))`;

    const result = stringifyAstToSql(code);
    expect(result).toBe('CONCAT((- (1 - 1)))');
  });

  test('function RANDOM can be without params', () => {
    const code = 'RANDOM()';
    const result = stringifyAstToSql(code);

    expect(result).toBe('RANDOM()');
  });

  test(`function CONCAT can work with IfStatementNode in args if it return one type`, () => {
    const code = `CONCAT(IF(2 > 1, "a", "b"))`;

    const result = stringifyAstToSql(code);
    expect(result).toBe(
      `CONCAT((CASE WHEN (2 > 1) THEN ('a')::text ELSE ('b')::text END)::TEXT)`,
    );
  });

  test(`function CONCAT can work with IfStatementNode in args if it returns number | text types`, () => {
    const code = `CONCAT(IF(2 > 1, 1, "b"))`;

    const result = stringifyAstToSql(code);
    expect(result).toBe(
      `CONCAT((CASE WHEN (2 > 1) THEN (1)::text ELSE ('b')::text END)::TEXT)`,
    );
  });

  test('function LOWER can work with IfStatementNode if it may return different types', () => {
    const code = 'LOWER(IF(2 > 1, 1, ""))';

    expect(stringifyAstToSql(code)).toBe(
      `LOWER((CASE WHEN (2 > 1) THEN (1)::text ELSE ('')::text END)::TEXT)`,
    );
  });
});

describe('function node errors', () => {
  test('function TESTFUNC don’t support', () => {
    const code = `TESTFUNC()`;

    expect(() => stringifyAstToSql(code)).toThrow(
      'Invalid function TESTFUNC at the position 0',
    );
  });

  test('function TOSTRING can work with one arg', () => {
    const code = 'TO_STRING("test", 1)';

    expect(() => stringifyAstToSql(code)).toThrow(
      'Unexpected type of data when TO_STRING on the position 0',
    );
  });

  test('DATE should has 3 args', () => {
    const code = 'DATE(10, 1)';

    expect(() => stringifyAstToSql(code)).toThrow(
      'Invalid arguments count in DATE function at the position 0',
    );
  });

  test('function CONCAT can’t be without params', () => {
    const code = `CONCAT()`;

    expect(() => stringifyAstToSql(code)).toThrow(
      'Unexpected type of data when CONCAT on the position 0',
    );
  });

  test('function CONCAT can’t work with many args which not all has type string or num', () => {
    const code = 'CONCAT("test", "test2", true)';

    expect(() => stringifyAstToSql(code)).toThrow(
      'Unexpected type of data when CONCAT on the position 0',
    );
  });

  test('function CONCAT can’t work with keyword', () => {
    const code = `CONCAT(false)`;

    expect(() => stringifyAstToSql(code)).toThrow(
      'Unexpected type of data when CONCAT on the position 0',
    );
  });

  test(`function CONCAT can't work with expression which return unknown type in args`, () => {
    const code = 'CONCAT(1 - "")';

    expect(() => stringifyAstToSql(code)).toThrow(
      'Unexpected type of data when CONCAT on the position 0',
    );
  });

  test(`function CONCAT can't work with parenthsized expression in args which has errors`, () => {
    const code = `CONCAT((1 + 1 + 1 + RANDOM()), CONCAT("", 1, 2, "test"), (RANDOM() + RANDOM() - ""))`;

    expect(() => stringifyAstToSql(code)).toThrow(
      'Unexpected type of data when CONCAT on the position 0',
    );
  });

  test(`func should can work with high nesting funcs in args, but if the chain somewhere returns the wrong type we interrupt it`, () => {
    const code = `CONCAT(CONCAT(CONCAT(RANDOM(CONCAT("2")))))`;

    expect(() => stringifyAstToSql(code)).toThrow(
      'Unexpected type of data when CONCAT on the position 0',
    );
  });

  test('function RANDOM can’t be with params', () => {
    const code = 'RANDOM(1)';

    expect(() => stringifyAstToSql(code)).toThrow(
      'Unexpected type of data when RANDOM on the position 0',
    );
  });
});
