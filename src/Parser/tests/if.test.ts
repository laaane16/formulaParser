import { stringifyAstToJs } from './helpers/stringifyAstToJs';
import { stringifyAstToSql } from './helpers/stringifyAstToSql';

describe('ifStatementNode to sql', () => {
  test('if can work with all types', () => {
    const code = 'IF(1 < 2, "", true)';

    const res = stringifyAstToSql(code);
    expect(res).toBe("CASE WHEN 1 < 2 THEN '' ELSE true END");
  });

  test('if can work with expressions', () => {
    const code = 'IF((1 + 1 + RANDOM()) == 2.5, "win", "lose")';

    const res = stringifyAstToSql(code);
    expect(res).toBe(
      "CASE WHEN (1 + 1 + RANDOM()) = 2.5 THEN 'win' ELSE 'lose' END",
    );
  });

  test('if can work with nested ifs', () => {
    const code =
      'IF(IF(1 == 1, "a", "b") == "a", IF(IF(2 > 1, "z", "c") == "c", "q", "w"), "lose")';

    const res = stringifyAstToSql(code);
    expect(res).toBe(
      "CASE WHEN CASE WHEN 1 = 1 THEN 'a' ELSE 'b' END = 'a' THEN CASE WHEN CASE WHEN 2 > 1 THEN 'z' ELSE 'c' END = 'c' THEN 'q' ELSE 'w' END ELSE 'lose' END",
    );
  });
});

describe('ifStatementNode to js', () => {
  test('', () => {});
});

describe('ifStatementNode errors', () => {
  test('', () => {});
});
