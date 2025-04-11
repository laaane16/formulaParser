import Parser, { IField } from '../../..';

export const stringifyAstToSql = (
  code: string,
  fields: IField[] = [],
): string => {
  const parser = new Parser(code, fields ?? []);
  const sqlQuery = parser.toSql();

  return sqlQuery;
};
