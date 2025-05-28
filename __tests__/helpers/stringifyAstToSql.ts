import Parser from '../../src/main';
import { IVar } from '../../src/types';

export const stringifyAstToSql = (
  code: string,
  fields?: Record<string, IVar>,
): string => {
  const parser = new Parser(code, fields);
  const sqlQuery = parser.toSql();

  return sqlQuery;
};
