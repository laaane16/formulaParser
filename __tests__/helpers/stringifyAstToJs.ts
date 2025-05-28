import Parser from '../../src/main';
import { IVar } from '../../src/types';

export const stringifyAstToJs = (
  code: string,
  fields?: Record<string, IVar>,
): string => {
  const parser = new Parser(code, fields);
  const sqlQuery = parser.toJs();

  return sqlQuery;
};
