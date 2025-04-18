import Parser, { IField } from '../../src/main';

export const stringifyAstToJs = (code: string, fields?: IField[]): string => {
  const parser = new Parser(code, fields);
  const sqlQuery = parser.toJs();

  return sqlQuery;
};
