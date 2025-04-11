import Parser from '../..';
import { FORMATS } from '../../../constants/formats';
import Lexer from '../../../Lexer';

export const stringifyAstToJs = (code: string, prepareFields?: []): string => {
  const lexer = new Lexer(code);
  lexer.lexAnalysis();

  const parser = new Parser(lexer.tokens);
  if (prepareFields) {
    parser.initVars(prepareFields);
  }
  const node = parser.parseCode();

  const result = parser.stringifyAst(node, FORMATS.JS)[0];

  return result;
};
