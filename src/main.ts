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
  dbId?: number;
  name: string;
  type: string;
}

export type FIELD_ATTR_TYPE = keyof IField;

/**
 * The `Parser` class is responsible for converting a JavaScript-like expression into an SQL query.
 */
export default class Parser {
  public expression: string;
  private lexer: Lexer;
  private fields: IField[];
  public fieldAttribute: FIELD_ATTR_TYPE;

  /**
   * Creates a new `Parser` instance.
   * @param {string} expression - The input formula or expression.
   * @param {IField[]} [fields=[]] - An optional array of field metadata.
   */
  constructor(
    expression: string,
    fields: IField[] = [],
    fieldAttribute: FIELD_ATTR_TYPE = 'id',
  ) {
    if (isNil(expression)) FormulaError.requiredParamsError(['expression']);
    this.expression = expression;
    this.lexer = new Lexer(expression);
    this.fields = fields;
    this.fieldAttribute = fieldAttribute;
  }

  /**
   * Prepares the field mappings for use in the parsing process.
   * @returns {IField[]} The mapped field objects.
   */
  private prepareFields(): IField[] {
    return this.fields.map((field) => ({
      name: `${PREFIX}${field[this.fieldAttribute]}${POSTFIX}`,
      id: field.id,
      type: field.type,
      ...(field.dbId && { dbId: field.dbId }),
    }));
  }

  /**
   * Walk by ast nodes
   * @example
   * getUsedVariables() {
   * const variables = new Set();
   * this.walkAst(n => {
   * if (n.type === 'Variable') {
   *    variables.add(n.name);
   *  }
   * });
   * return [...variables];
   * }
   */
  walkAst(callback: (node: ExpressionNode) => void): void {
    const ast = this.getAst();
    this._walkNode(ast, callback);
  }

  private _walkNode(
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
            this._walkNode(c as ExpressionNode, callback);
          }
        });
      } else if (typeof child === 'object' && child !== null) {
        this._walkNode(child as ExpressionNode, callback);
      }
    }
  }

  /**
   * lexic analyze code and parse to ast
   */
  prepareParser(): [ParserCore, StatementsNode] {
    if (this.lexer.tokens.length === 0) {
      this.lexer.lexAnalysis();
    }

    const parser = new ParserCore(this.lexer.tokens);
    parser.initVars(this.prepareFields(), this.fieldAttribute);
    const node = parser.parseCode();

    return [parser, node];
  }

  /**
   * get AST tree
   * @returns {StatementsNode}
   */
  getAst(): StatementsNode {
    const [_, node] = this.prepareParser();
    return node;
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
// const fields: IField[] = [
//   { id: '1', name: 'Поле 1', type: 'number' },
//   { id: '2', name: 'Поле 2', type: 'number' },
//   { id: '3', name: 'Поле 3', type: 'number' },
//   { id: '9', name: 'Поле 4', type: 'number' },
//   { id: 'FIELD123123', name: 'Поле 5', type: 'number' },
// ];

// const values: Record<string, unknown> = {
//   1: 1000,
//   2: 5000,
//   3: 100,
//   9: 1000,
//   FIELD123123: 150,
// };

// const expression =
//   '{{Поле 1}} + {{Поле 2}} + {{Поле 3}} + {{Поле 4}} + {{Поле 5}}';

// const parser = new Parser(expression, fields);

// const sqlQuery = parser.toSql();
// console.log('SQL:', sqlQuery); // Outputs the generated SQL query

// const jsFormula = parser.toJs();
// console.log('JS:', jsFormula); // Outputs the generated JS query

// console.log('RUN JS:', parser.runJs(jsFormula, values));
