import Parser, { IVar } from '../../src/main';

export const stringifyAstToJs = (
  code: string,
  fields?: Record<string, IVar>,
): string => {
  const parser = new Parser(code, fields);
  const sqlQuery = parser.toJs();

  return sqlQuery;
};
