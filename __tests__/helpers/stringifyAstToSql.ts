import Parser, { FIELD_ATTR_TYPE, IField } from '../../src/main';

export const stringifyAstToSql = (
  code: string,
  fields?: IField[],
  attr?: FIELD_ATTR_TYPE,
): string => {
  const parser = new Parser(code, fields, attr);
  const sqlQuery = parser.toSql();

  return sqlQuery;
};
