import Parser, { IVar } from '../../src/main';

export const stringifyAstToSql = (
  code: string,
  fields?: Record<string, IVar>,
): string => {
  const parser = new Parser(code, fields);
  const sqlQuery = parser.toSql();

  return sqlQuery;
};
