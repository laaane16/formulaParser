import { DateTime } from 'luxon';

import Lexer from './Lexer';
import ParserCore from './Parser';

import ExpressionNode from './AST/ExpressionNode';
import StatementsNode from './AST/StatementsNode';

import { defaultVarAttr } from './constants/defaults';
import { NodeTypesValues } from './constants/nodeTypes';
import { FORMATS } from './constants/formats';
import {
  castMapper,
  JS_CAST_TYPES,
  SQL_CAST_TYPES,
  typesMapper,
} from './constants/typesMapper';

import { FormulaError } from './lib/exceptions';
import { isNil } from './lib/isNil';
import { validateResultJs } from './lib/valiadateResultJs';

import { IVar, Variables } from './types';
import { BpiumValues } from './types';
/**
 * The `Parser` class is responsible for converting a JavaScript-like expression into an SQL or JS expression.
 * It supports field mapping, AST parsing, variable extraction, and execution of parsed formulas.
 */
export default class Parser {
  public expression: string;
  private lexer: Lexer;
  private root?: StatementsNode;
  private variables: Variables;

  /**
   * Creates a new `Parser` instance.
   * @param {string} expression - The input formula or expression.
   */
  constructor(
    expression: string,
    variables: Variables | IVar[] = {},
    varAttr?: string,
  ) {
    if (isNil(expression) || expression.length === 0)
      FormulaError.requiredParamsError(['expression']);
    this.expression = expression;
    this.lexer = new Lexer(expression);
    const preparedVariables = this._prepareVariables(variables, varAttr);
    this.variables = preparedVariables;
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
   * Set new variables
   */
  public setVariables(variables: Variables | IVar[] = {}, varAttr?: string) {
    const preparedVariables = this._prepareVariables(variables, varAttr);
    this.variables = preparedVariables;
  }

  /**
   *
   * @param variables
   * @param varAttr
   * @returns
   */
  private _prepareVariables(
    variables: Variables | IVar[] = {},
    varAttr?: string,
  ) {
    if (Array.isArray(variables)) {
      const attr = varAttr ?? defaultVarAttr;
      return variables.reduce<Record<string, IVar>>((accumulator, current) => {
        const objAttr = current[attr];
        if (objAttr) {
          accumulator[String(objAttr)] = current;
        }
        return accumulator;
      }, {});
    } else {
      return variables;
    }
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
   * Removes templating syntax from variables (e.g., `{...}`).
   * @returns {string[]} An array of unique variable names.
   */
  public getVariables(): string[] {
    const [parser, _] = this.prepareParser();
    const rawVariables = parser.getVariables(this.getAst());

    return Array.from(rawVariables);
  }

  /**
   * Extracts the list of unique functions used in the expression.
   * @returns {Set<string>} An array of unique functions.
   */
  public getUsedFunctions(): Set<string> {
    const [parser, _] = this.prepareParser();
    const rawFunctions = parser.getFunctions(this.getAst());

    return rawFunctions;
  }

  /**
   * return new string with replacing variables on any variable attribute, but mutate variables keys
   */
  public mapIdentifiers({
    from,
    to,
  }: {
    from?: keyof IVar | (keyof IVar)[];
    to: keyof IVar | (keyof IVar)[];
  }): string {
    const [parser, node] = this.prepareParser();
    return parser.mapIdentifiers(node, { from, to })[0];
  }

  /**
   * Converts the parsed expression into an SQL string with variables replacement.
   * @returns {string} The SQL representation of the formula.
   */
  public toSqlWithVariables(
    safe = false,
    values = {},
    bpiumValues?: BpiumValues,
  ): string {
    const [parser, node] = this.prepareParser();
    return parser.stringifyAst({
      node,
      format: FORMATS.SQL,
      safe,
      values,
      bpiumValues,
    })[0]; // Currently, returns only the first SQL line
  }

  /**
   * Converts the parsed expression into a JavaScript-evaluable string.
   * @returns {string} The JS representation of the formula.
   */
  public toJs(safe = false, bpiumValues?: BpiumValues): string {
    const [parser, node] = this.prepareParser();
    return parser.stringifyAst({
      node,
      format: FORMATS.JS,
      safe,
      bpiumValues,
    })[0]; // Currently, returns only the first JS line
  }

  /**
   * Evaluates the JavaScript formula string with the given variable values.
   * @param {string} jsFormula - The JavaScript formula string.
   * @param {Record<string, unknown>} values - An object with key-value pairs for variables. Key always id in fields
   * @returns {unknown} The result of formula evaluation.
   */
  public runJs(
    jsFormula: string,
    values?: Record<string, unknown>,
    // safe: boolean = false,
  ): unknown {
    const runFormula = new Function(
      'DateTime',
      '$$VARIABLES',
      `
       return ${jsFormula}
      `,
    )(DateTime, values);
    validateResultJs(runFormula);

    return runFormula;
  }

  /**
   *
   * @param result - result after runJs or toSqlWithVariables
   */
  public castResultType(
    result: unknown,
    format: 'js' | 'sql',
    to: NodeTypesValues,
    validate?: unknown,
  ): unknown {
    const resultType =
      castMapper[to as keyof typeof castMapper] ||
      typesMapper[to as keyof typeof typesMapper] ||
      to;
    if (format === 'js') {
      const res = JS_CAST_TYPES[resultType](result, validate);
      const preparedResult = this._prepareJsResult(res);
      return preparedResult;
    }
    if (format === 'sql') {
      const res = SQL_CAST_TYPES[resultType](result, validate);
      return res;
    }
  }

  private _prepareJsResult(res: unknown): unknown {
    switch (typeof res) {
      case 'number':
        if (!Number.isNaN(res)) {
          return res;
        }
        return null;
      case 'string':
        return res;
      case 'boolean':
        return res;
      case 'object':
        if (res === null) {
          return null;
        }
        if (Array.isArray(res)) {
          return res;
        }
        if (res instanceof DateTime && res.isValid) {
          return res.toFormat('yyyy-LL-dd HH:mm:ssZZZ').slice(0, -2);
        }
        return null;
      default:
        throw new Error('Unsupported type right now');
    }
  }
}

// Example usage:
// key - value in {...}
// const variables: Record<string, IVar> = {
//   1: {
//     id: '1',
//     dbId: 2,
//     prevId: '3',
//     name: 'Поле 1',
//     type: 'date',
//   },
//   some: {
//     name: 'Поле 2',
//     dbId: 5,
//     id: '2',
//     type: 'number',
//   },
//   status: {
//     name: 'status',
//     id: '3',
//     type: 'dropdown',
//   },
// };

// const values: Record<string, unknown> = {
//   1: '2012-12-12 00:00:00+03',
//   some: 5000,
//   status: [
//     { id: '2', dbId: 123, name: 'Завершено' },
//     { id: '3', dbId: 124, name: 'В процессе' },
//   ],
// };

// const sqlValues = {
//   1: 'field1',
//   some: 'field2',
//   status: 'field5',
// };

// const bpiumValues = {
//   catalogId: 'teeest',
//   recordDbId: 12,
// };

// const expression = 'TOSTRING(123)';

// const parser = new Parser(expression, variables);

// const sqlQuery = parser.toSqlWithVariables(true, sqlValues, bpiumValues);
// console.log('SQL:', sqlQuery); // Outputs the generated SQL query

// const jsFormula = parser.toJs(true, bpiumValues);
// console.log('JS:', jsFormula); // Outputs the generated JS query

// console.log('RUN JS:', parser.runJs(jsFormula, values));

// console.log(
//   parser.castResultType(parser.runJs(jsFormula, values), 'js', 'text', [
//     ['2', '3'],
//     ['Завершено', 'В процессе'],
//   ]),
//   parser.castResultType(sqlQuery, 'sql', 'text', [
//     ['2', '3'],
//     ['Завершено', 'В процессе'],
//     'field5_names',
//   ]),
// );
