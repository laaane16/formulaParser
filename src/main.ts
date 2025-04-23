import ExpressionNode from './AST/ExpressionNode';
import StatementsNode from './AST/StatementsNode';
import Lexer from './Lexer';
import ParserCore from './Parser';
import { defaultVarAttr } from './constants/defaults';
import { FORMATS } from './constants/formats';
import { FormulaError } from './lib/exceptions';
import { isNil } from './lib/isNil';
import { removePrefixSuffix } from './lib/removePrefixSuffix';

export interface IVar {
  type: string;
  id?: string;
  [key: string]: unknown;
}

/**
 * The `Parser` class is responsible for converting a JavaScript-like expression into an SQL or JS expression.
 * It supports field mapping, AST parsing, variable extraction, and execution of parsed formulas.
 */
export default class Parser {
  public expression: string;
  private lexer: Lexer;
  private root?: StatementsNode;
  private variables: Record<string, IVar>;

  /**
   * Creates a new `Parser` instance.
   * @param {string} expression - The input formula or expression.
   */
  constructor(
    expression: string,
    variables: Record<string, IVar> | IVar[] = {},
  ) {
    if (isNil(expression)) FormulaError.requiredParamsError(['expression']);
    this.expression = expression;
    this.lexer = new Lexer(expression);
    if (Array.isArray(variables)) {
      this.variables = variables.reduce<Record<string, IVar>>(
        (accumulator, current) => {
          const objAttr = current[defaultVarAttr];
          if (objAttr && typeof objAttr === 'string') {
            accumulator[objAttr] = current;
          }
          return accumulator;
        },
        {},
      );
    } else {
      this.variables = variables;
    }
  }

  /**
   * Performs lexical analysis and parses the expression into an AST.
   * @returns {[ParserCore, StatementsNode]} A tuple containing the parser instance and the root AST node.
   */
  public prepareParser(): [ParserCore, StatementsNode] {
    if (this.lexer.tokens.length === 0) {
      this.lexer.lexAnalysis();
    }

    let node;
    const parser = new ParserCore(this.lexer.tokens, this.variables);
    if (this.root) {
      node = this.root;
    } else {
      node = parser.parseCode();
      this.root = node;
    }

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
    const variables: Set<string> = new Set();

    this.walkAst((node) => {
      const rawVariables = Array.from(parser.getVariables(node));
      rawVariables.forEach((variable) => {
        const cleanedVariable = removePrefixSuffix(variable);
        variables.add(cleanedVariable);
      });
    });

    return Array.from(variables);
  }

  /**
   * return new string with replacing variables on any variable attribute, but mutate variables keys
   */
  public mapIdentifiers({
    from,
    to,
  }: {
    from?: keyof IVar | undefined;
    to: keyof IVar;
  }): string {
    const [parser, node] = this.prepareParser();
    return parser.mapIdentifiers(node, { from, to })[0];
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
   * @param {Record<string, unknown>} values - An object with key-value pairs for variables. Key always id in fields
   * @returns {unknown} The result of formula evaluation.
   */
  public runJs(jsFormula: string, values: Record<string, unknown>): unknown {
    const runFormula = new Function('$$VARIABLES', `return ${jsFormula}`)(
      values,
    );
    return runFormula;
  }
  /**
   * Replace vars on values
   * @param {string} sqlFormula - The Sql format formula
   * @param {Record<string, unknown>} values - An object with key-value pairs for variables. Key always id in fields
   */
  public replaceWithVariables(
    sqlFormula: string,
    values: Record<string, unknown>,
  ): string {
    return sqlFormula.replace(/\$\$VARIABLES\['(.*?)'\]/g, (_, key) => {
      return JSON.stringify(values[key]);
    });
  }
}

// Example usage:
// key - value in {{...}}
// const variables: Record<string, IVar> = {
//   1: {
//     id: '1',
//     dbId: 2,
//     prevId: '3',
//     name: 'Поле 1',
//     type: 'number',
//   },
//   some: {
//     name: 'Поле 2',
//     dbId: 5,
//     id: '2',
//     type: 'number',
//   },
// };

// const values: Record<string, unknown> = {
//   1: 1000,
//   some: 5000,
// };

// const expression = '{{1}} + {{some}}';

// const parser = new Parser(expression, variables);

// const sqlQuery = parser.toSql();
// console.log('SQL:', sqlQuery); // Outputs the generated SQL query

// const jsFormula = parser.toJs();
// console.log('JS:', jsFormula); // Outputs the generated JS query

// console.log('RUN JS:', parser.runJs(jsFormula, values));

// console.log(parser.replaceWithVariables(sqlQuery, values));
