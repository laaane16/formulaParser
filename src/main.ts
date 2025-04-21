import ExpressionNode from './AST/ExpressionNode';
import StatementsNode from './AST/StatementsNode';
import Lexer from './Lexer';
import ParserCore from './Parser';
import { FORMATS } from './constants/formats';
import { FORMULA_TEMPLATES } from './constants/templates';
import { FormulaError } from './lib/exceptions';
import { isNil } from './lib/isNil';
import { removePrefixSuffix } from './lib/removePrefixSuffix';

export interface IField {
  id: string;
  dbId?: number;
  name: string;
  type: string;
}

export type FIELD_ATTR_TYPE = keyof IField;

/**
 * The `Parser` class is responsible for converting a JavaScript-like expression into an SQL or JS expression.
 * It supports field mapping, AST parsing, variable extraction, and execution of parsed formulas.
 */
export default class Parser {
  public expression: string;
  private lexer: Lexer;
  private fields: IField[];
  public fieldAttribute: FIELD_ATTR_TYPE;

  /**
   * Creates a new `Parser` instance.
   * @param {string} expression - The input formula or expression.
   * @param {IField[]} [fields=[]] - Optional list of field definitions.
   * @param {FIELD_ATTR_TYPE} [fieldAttribute='id'] - The field attribute to use for variable binding.
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
   * Prepares the field mappings with templated variable names for use in parsing.
   * @returns {IField[]} The transformed fields with templated names.
   */
  private prepareFields(): IField[] {
    return this.fields.map((field) => ({
      name: `${FORMULA_TEMPLATES.PREFIX}${field[this.fieldAttribute]}${FORMULA_TEMPLATES.POSTFIX}`,
      id: field.id,
      type: field.type,
      ...(field.dbId && { dbId: field.dbId }),
    }));
  }

  /**
   * Performs lexical analysis and parses the expression into an AST.
   * @returns {[ParserCore, StatementsNode]} A tuple containing the parser instance and the root AST node.
   */
  public prepareParser(): [ParserCore, StatementsNode] {
    if (this.lexer.tokens.length === 0) {
      this.lexer.lexAnalysis();
    }

    const parser = new ParserCore(this.lexer.tokens);
    parser.initVars(this.prepareFields(), this.fieldAttribute);
    const node = parser.parseCode();

    return [parser, node];
  }

  /**
   * Gets the root AST node for the parsed expression.
   * @returns {StatementsNode} The abstract syntax tree.
   */
  public getAst(): StatementsNode {
    const [_, node] = this.prepareParser();
    return node;
  }

  /**
   * Walks the AST and invokes the callback for every node.
   * @param {(node: ExpressionNode) => void} callback - The function to call on each AST node.
   */
  public walkAst(callback: (node: ExpressionNode) => void): void {
    const ast = this.getAst();
    this._walkNode(ast, callback);
  }

  /**
   * Internal recursive function to walk each AST node.
   * @param {ExpressionNode} node - The current AST node.
   * @param {(node: ExpressionNode) => void} callback - The function to call on each node.
   */
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
   * Extracts the list of unique variable names used in the expression.
   * Removes templating syntax from variables (e.g., `{{...}}`).
   * @returns {string[]} An array of unique variable names.
   */
  public getVariables(): string[] {
    const [parser, _] = this.prepareParser();
    const variables: Set<string> = new Set(); // Используем Set для уникальных переменных

    // Пройдем по AST и для каждого узла получаем переменные
    this.walkAst((node) => {
      // Получаем переменные, обрезая префикс и постфикс
      const rawVariables = Array.from(parser.getVariables(node));
      rawVariables.forEach((variable) => {
        const cleanedVariable = removePrefixSuffix(variable);
        variables.add(cleanedVariable); // Добавляем в Set, который автоматически исключает дубли
      });
    });

    return Array.from(variables); // Преобразуем Set обратно в массив
  }

  /**
   * Converts the parsed expression into an SQL string.
   * @returns {string} The SQL representation of the formula.
   */
  public toSql(): string {
    const [parser, node] = this.prepareParser();
    return parser.stringifyAst(node, FORMATS.SQL)[0]; // Currently, returns only the first SQL line
  }
  /**
   * Converts the parsed expression into a JavaScript-evaluable string.
   * @returns {string} The JS representation of the formula.
   */
  public toJs(): string {
    const [parser, node] = this.prepareParser();
    return parser.stringifyAst(node, FORMATS.JS)[0]; // Currently, returns only the first JS line
  }

  /**
   * Evaluates the JavaScript formula string with the given variable values.
   * @param {string} jsFormula - The JavaScript formula string.
   * @param {Record<string, unknown>} values - An object with key-value pairs for variables.
   * @returns {unknown} The result of formula evaluation.
   */
  public runJs(jsFormula: string, values: Record<string, unknown>): unknown {
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
