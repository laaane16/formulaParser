import { Parser } from '../../../src';

describe('ifStatementNode special tests', () => {
  test('if can work with all types', () => {
    const parser = new Parser(`IF(1 < 2, '', true)`);
    expect(parser.toSql()).toBe(
      "(CASE WHEN (1 < 2) THEN ('')::text ELSE (true)::text END)",
    );
  });

  test('if can work with expressions', () => {
    const parser = new Parser('IF((1 + 1 + RANDOM()) == 2.5, "win", "lose")');
    expect(parser.toSql()).toBe(
      "(CASE WHEN ((1 + 1 + RANDOM()) = 2.5) THEN ('win')::text ELSE ('lose')::text END)",
    );
  });

  test('if can work with nested ifs', () => {
    const parser = new Parser(
      'IF(IF(1 == 1, "a", "b") == "a", IF(IF(2 > 1, "z", "c") == "c", "q", "w"), "lose")',
    );
    expect(parser.toSql()).toBe(
      "(CASE WHEN ((CASE WHEN (1 = 1) THEN ('a')::text ELSE ('b')::text END)::TEXT = 'a') THEN ((CASE WHEN ((CASE WHEN (2 > 1) THEN ('z')::text ELSE ('c')::text END)::TEXT = 'c') THEN ('q')::text ELSE ('w')::text END)::TEXT)::text ELSE ('lose')::text END)",
    );
  });
});

describe('errors', () => {
  test('unexpected data type in if', () => {
    const parser = new Parser('MOD(IF(1 > 2, "test", 1), 3)');

    expect(() => parser.toJs()).toThrow();
  });
});
