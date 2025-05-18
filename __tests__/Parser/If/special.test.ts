import { Parser } from '../../../src';

describe('ifStatementNode special tests', () => {
  // test('if can work with all types', () => {
  //   const parser = new Parser(`IF(1 < 2, '', true)`);
  //   expect(parser.toSql()).toBe("CASE WHEN 1 < 2 THEN '' ELSE true END");
  // });

  test('if can work with expressions', () => {
    const parser = new Parser('IF((1 + 1 + RANDOM()) == 2.5, "win", "lose")');
    expect(parser.toSql()).toBe(
      "(CASE WHEN (1 + 1 + RANDOM()) = 2.5 THEN 'win' ELSE 'lose' END)",
    );
  });

  test('if can work with nested ifs', () => {
    const parser = new Parser(
      'IF(IF(1 == 1, "a", "b") == "a", IF(IF(2 > 1, "z", "c") == "c", "q", "w"), "lose")',
    );
    expect(parser.toSql()).toBe(
      "(CASE WHEN (CASE WHEN 1 = 1 THEN 'a' ELSE 'b' END) = 'a' THEN (CASE WHEN (CASE WHEN 2 > 1 THEN 'z' ELSE 'c' END) = 'c' THEN 'q' ELSE 'w' END) ELSE 'lose' END)",
    );
  });
});
