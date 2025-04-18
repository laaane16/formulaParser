import ExpressionNode from './AST/ExpressionNode';
import StatementsNode from './AST/StatementsNode';
import Lexer from './Lexer';
import ParserCore from './Parser';
import { FORMATS } from './constants/formats';
import { FormulaError } from './lib/exceptions';
import { isNil } from './lib/isNil';

const PREFIX = '{{';
const POSTFIX = '}}';

export interface IField {
  id: string;
  title: string;
  type: string;
}

/**
 * The `Parser` class is responsible for converting a JavaScript-like expression into an SQL query.
 */
export default class Parser {
  public expression: string;
  private lexer: Lexer;
  private fields: IField[];

  /**
   * Creates a new `Parser` instance.
   * @param {string} expression - The input formula or expression.
   * @param {IField[]} [fields=[]] - An optional array of field metadata.
   */
  constructor(expression: string, fields: IField[] = []) {
    if (isNil(expression)) FormulaError.requiredParamsError(['expression']);
    this.expression = expression;
    this.lexer = new Lexer(expression);
    // if (fields.length === 0) FormulaError.requiredParamsError(['fields']);
    this.fields = fields;
  }

  /**
   * Prepares the field mappings for use in the parsing process.
   * @returns {Array<{ title: string, value: string, type: string }>} The mapped field objects.
   */
  private prepareFields(): { title: string; value: string; type: string }[] {
    return this.fields.map((field) => ({
      title: `${PREFIX}${field.title}${POSTFIX}`,
      value: field.id,
      type: field.type,
    }));
  }

  /**
   * Walk by ast nodes
   * @example
   * getUsedVariables() {
   * const [, node] = this.prepareParser();
   * const variables = new Set();
   * this.walkAst(node, n => {
   * if (n.type === 'Variable') {
   *    variables.add(n.name);
   *  }
   * });
   * return [...variables];
   * }
   */
  walkAst(
    node: ExpressionNode,
    callback: (node: ExpressionNode) => void,
  ): void {
    if (!node || typeof node !== 'object') return;

    callback(node);

    for (const key of Object.keys(node) as (keyof ExpressionNode)[]) {
      const child = node[key];

      if (Array.isArray(child)) {
        child.forEach((c) => {
          if (typeof c === 'object' && c !== null) {
            this.walkAst(c as ExpressionNode, callback);
          }
        });
      } else if (typeof child === 'object' && child !== null) {
        this.walkAst(child as ExpressionNode, callback);
      }
    }
  }

  /**
   * lexic analyze code and parse to ast
   */
  prepareParser(): [ParserCore, StatementsNode] {
    this.lexer.lexAnalysis();
    const parser = new ParserCore(this.lexer.tokens);

    parser.initVars(this.prepareFields());
    const node = parser.parseCode();

    return [parser, node];
  }

  /**
   * Converts the input expression into an SQL query.
   * @returns {string} The generated SQL query.
   */
  toSql(): string {
    const [parser, node] = this.prepareParser();
    return parser.stringifyAst(node, FORMATS.SQL)[0]; // Currently, returns only the first SQL line
  }

  /**
   * Converts the input expression into an Js format.
   * @returns {string} The generated Js string, which can evaluate.
   */
  toJs(): string {
    const [parser, node] = this.prepareParser();
    return parser.stringifyAst(node, FORMATS.JS)[0]; // Currently, returns only the first JS line
  }

  // fields in stringify to ast converts in VARIABLES.$[VARIABLE_ID]
  runJs(jsFormula: string, values: Record<string, unknown>): unknown {
    const runFormula = new Function('VARIABLES', `return ${jsFormula}`)(values);
    return runFormula;
  }
}

// Example usage:
// const fields = [
//   { id: '1', title: 'Поле 1', type: 'number' },
//   { id: '2', title: 'Поле 2', type: 'number' },
//   { id: '3', title: 'Поле 3', type: 'text' },
// ];

// const values = {
//   1: 1000,
//   2: 5000,
//   3: 'testtext',
// };

// const expression = 'LEN(REPEAT(REPEAT({{Поле 3}},2),2)) + 1+  LEN(REPEAT("zxc", 1))';

// const parser = new Parser(expression, fields);

// const sqlQuery = parser.toSql();
// console.log('SQL:', sqlQuery); // Outputs the generated SQL query

// const jsFormula = parser.toJs();
// console.log('JS:', jsFormula); // Outputs the generated JS query

// console.log('RUN JS:', parser.runJs(jsFormula, values));
