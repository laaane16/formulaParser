import Token from '../Lexer/Token';
import TokenType, {
  tokenTypesBinOperations,
  tokenTypesBoolean,
  tokenTypesList,
  tokenTypesUnarOperations,
} from '../Lexer/TokenType';

import BinOperationNode from '../AST/BinOperationNode';
import ExpressionNode from '../AST/ExpressionNode';
import FunctionNode from '../AST/FunctionNode';
import LiteralNode from '../AST/LiteralNode';
import NumberNode from '../AST/NumberNode';
import ParenthesizedNode from '../AST/ParenthesizedNode';
import StatementsNode from '../AST/StatementsNode';
import VariableNode from '../AST/VariableNode';
import UnarOperationNode from '../AST/UnarOperationNode';
import IfStatementNode from '../AST/IfStatementNode';
import BooleanNode from '../AST/BooleanNode';
import SpaceNode from '../AST/SpaceNode';
import ArrayNode from '../AST/ArrayNode';

import { allFunctions } from './mappers/functions';
import { isSafeFunction, ValidFunctionsNames } from './mappers/functions/types';
import { allUnarOperators } from './mappers/unarOperators';
import { ValidUnarOperatorsNames } from './mappers/unarOperators/types';
import { ifStatementMap } from './mappers/if';
import { allBinOperators } from './mappers/binOperators';
import {
  isSafeOperator,
  ValidBinOperatorsNames,
} from './mappers/binOperators/types';

import { FORMATS } from '../constants/formats';
import {
  ARRAY_NODE_TYPE,
  BIN_OPERATION_NODE_TYPE,
  BOOLEAN_NODE_TYPE,
  FUNCTION_NODE_TYPE,
  IF_STATEMENT_NODE_TYPE,
  LITERAL_NODE_TYPE,
  NESTED_ARRAY_NODE_TYPE,
  NodeTypesValues,
  NUMBER_NODE_TYPE,
  PARENTHESIZED_NODE_TYPE,
  STATEMENTS_NODE_TYPE,
  UNAR_OPERATION_NODE_TYPE,
  UNKNOWN_NODE_TYPE,
  VARIABLE_NODE_TYPE,
} from '../constants/nodeTypes';
import {
  GetReturnTypeArgs,
  INodeReturnType,
  IVar,
  NodeStringifierMap,
  NodeTypesGettersMap,
  StringifyArgs,
} from '../types';
import { removePrefixSuffix } from '../lib/removePrefixSuffix';
import { FORMULA_TEMPLATES } from '../constants/templates';
import {
  ifTypesMapper,
  typesMapper,
  typesMapperJs,
  typesMapperSql,
} from '../constants/typesMapper';
import { operatorPrecedence } from '../constants/operatorPrecedence';
import { defaultValues } from '../constants/defaultValues';
import { FormulaError } from '../lib/exceptions';

export default class Parser {
  tokens: Token[];
  pos: number = 0;
  variables: Record<string, IVar> = {};
  returnTypesCache: Record<string, INodeReturnType> = {};
  possibleStringifiers: NodeStringifierMap;
  possibleTypesGetters: NodeTypesGettersMap;

  constructor(tokens: Token[], variables: Record<string, IVar>) {
    this.tokens = tokens;
    this.variables = variables;

    const possibleStringifiers: NodeStringifierMap = [
      [StatementsNode, this.stringifyStatementsNode.bind(this)],
      [NumberNode, this.stringifyNumberNode.bind(this)],
      [LiteralNode, this.stringifyLiteralNode.bind(this)],
      [BooleanNode, this.stringifyBooleanNode.bind(this)],
      [VariableNode, this.stringifyVariableNode.bind(this)],
      [ArrayNode, this.stringifyArrayNode.bind(this)],
      [ParenthesizedNode, this.stringifyParenthesizedNode.bind(this)],
      [UnarOperationNode, this.stringifyUnarOperationNode.bind(this)],
      [BinOperationNode, this.stringifyBinOperationNode.bind(this)],
      [IfStatementNode, this.stringifyIfStatementNode.bind(this)],
      [FunctionNode, this.stringifyFunctionNode.bind(this)],
    ];
    this.possibleStringifiers = possibleStringifiers;

    const possibleTypesGetters: NodeTypesGettersMap = [
      [NumberNode, this.getPrimitiveReturnType.bind(this)],
      [LiteralNode, this.getPrimitiveReturnType.bind(this)],
      [BooleanNode, this.getPrimitiveReturnType.bind(this)],
      [VariableNode, this.getVariableReturnType.bind(this)],
      [ArrayNode, this.getArrayReturnType.bind(this)],
      [ParenthesizedNode, this.getParenthesizedReturnType.bind(this)],
      [UnarOperationNode, this.getUnarReturnType.bind(this)],
      [BinOperationNode, this.getBinReturnType.bind(this)],
      [IfStatementNode, this.getIfReturnType.bind(this)],
      [FunctionNode, this.getFunctionReturnType.bind(this)],
    ];
    this.possibleTypesGetters = possibleTypesGetters;
  }

  // == PARSING EXPRESSION ==

  parseCode(): StatementsNode {
    const lastToken = this.tokens[this.tokens.length - 1];
    const statementEnd = lastToken.pos + lastToken.text.length;

    const root = new StatementsNode(statementEnd);

    while (this.pos < this.tokens.length) {
      // now we don`t support multiline expressions
      if (root.codeStrings.length > 0) {
        FormulaError.syntaxError(this.tokens[this.pos].pos);
      }
      const codeStringNode = this.parseExpression();
      // if we need make formula multiline, uncomment this string and add in tokens symbol, which mean end of line
      // this.require(END_LINE_SYMBOL)
      root.addNode(codeStringNode);
    }

    return root;
  }

  parseExpression(): ExpressionNode {
    let currentNode = this.getCurrentNode();
    let operator = this.match(...tokenTypesBinOperations);
    let rightNode;

    if (!operator) {
      return currentNode;
    }

    while (operator) {
      const precedence = operatorPrecedence[operator.token.name];
      rightNode = this.parseFormula(precedence);
      currentNode = new BinOperationNode(operator, currentNode, rightNode);
      operator = this.match(...tokenTypesBinOperations);
    }

    return currentNode;
  }

  getCurrentNode(): ExpressionNode {
    const parsersForPossibleResults = [
      this.parseLiteralNode,
      this.parseNumberNode,
      this.parseBooleanNode,
      this.parseVariableNode,
      this.parseUnarOperatorNode,
      this.parseParenthesizedNode,
      this.parseArrayNode,
      this.parseIfStatementNode,
      this.parseFunctionNode,
    ];

    // parser work with nodes from parseFormula and parseExpression, but they get first node fron this func,
    // we need left spaces and right because in funcs upper we try find bin operator after node, but parser find space
    const leftSpaces: SpaceNode[] = [];
    while (true) {
      const space = this.parseSpaceNode();
      if (!space) break;
      leftSpaces.push(space);
    }

    for (const parseFn of parsersForPossibleResults) {
      // with call method typescript  gets confused
      const possibleResult = parseFn.bind(this)();
      if (possibleResult !== null) {
        const rightSpaces: SpaceNode[] = [];
        while (true) {
          const space = this.parseSpaceNode();
          if (!space) break;
          rightSpaces.push(space);
        }

        possibleResult.leftSpaces = leftSpaces;
        possibleResult.rightSpaces = rightSpaces;

        return possibleResult;
      }
    }

    FormulaError.unknownTokenError(this.pos);
  }

  parseLiteralNode(): LiteralNode | null {
    const string = this.match(tokenTypesList.get('STRING') as TokenType);
    if (string) {
      return new LiteralNode(string);
    }

    return null;
  }

  parseSpaceNode(): SpaceNode | null {
    const space = this.match(tokenTypesList.get('SPACE') as TokenType);
    if (space) {
      return new SpaceNode(space);
    }

    return null;
  }

  parseNumberNode(): NumberNode | null {
    const number = this.match(tokenTypesList.get('NUMBER') as TokenType);
    if (number) {
      return new NumberNode(number);
    }

    return null;
  }

  parseBooleanNode(): BooleanNode | null {
    const keyword = this.match(...tokenTypesBoolean);
    if (keyword) {
      return new BooleanNode(keyword);
    }

    return null;
  }

  parseVariableNode(): VariableNode | null {
    const variable = this.match(tokenTypesList.get('VARIABLE') as TokenType);
    if (variable) {
      return new VariableNode(variable);
    }

    return null;
  }

  parseUnarOperatorNode(): UnarOperationNode | null {
    const unarOperator = this.match(...tokenTypesUnarOperations);
    if (unarOperator) {
      const node = this.parseFormula();
      return new UnarOperationNode(unarOperator, node);
    }

    return null;
  }

  parseParenthesizedNode(): ParenthesizedNode | null {
    const leftPar = this.match(tokenTypesList.get('LPAR') as TokenType);
    if (leftPar) {
      const node = this.parseFormula();
      this.require(tokenTypesList.get('RPAR') as TokenType);
      return new ParenthesizedNode(node);
    }

    return null;
  }

  parseArrayNode(): ArrayNode | null {
    const leftPar = this.match(tokenTypesList.get('ARRAYLPAR') as TokenType);
    if (leftPar) {
      const isBracketsEmpty = !!this.match(
        tokenTypesList.get('ARRAYRPAR') as TokenType,
      );
      if (isBracketsEmpty) {
        FormulaError.emptyArray(leftPar.pos);
      }
      const args = this.parseEnumeratedElems();
      this.require(tokenTypesList.get('ARRAYRPAR') as TokenType);
      return new ArrayNode(leftPar, args);
    }
    return null;
  }

  parseIfStatementNode(): IfStatementNode | null {
    const ifStatement = this.match(tokenTypesList.get('IF') as TokenType);
    if (ifStatement) {
      const leftPar = this.match(tokenTypesList.get('LPAR') as TokenType);
      if (leftPar) {
        const isBracketsEmpty = !!this.match(
          tokenTypesList.get('RPAR') as TokenType,
        );
        if (isBracketsEmpty) {
          FormulaError.emptyConditionalOperator(ifStatement.pos);
        }

        const result = [];
        let currentNode = this.parseFormula();
        if (currentNode) {
          result.push(currentNode);

          let virguleCount = 0;
          let virgule = this.match(tokenTypesList.get('VIRGULE') as TokenType);
          while (virgule) {
            if (virguleCount >= 2) {
              FormulaError.unexpectedArgunmentCount(virgule.pos + 1);
            }
            virguleCount++;
            currentNode = this.parseFormula();
            result.push(currentNode);
            virgule = this.match(tokenTypesList.get('VIRGULE') as TokenType);
          }
        }

        this.require(tokenTypesList.get('RPAR') as TokenType);
        return new IfStatementNode(
          ifStatement,
          result[0],
          result[1],
          result[2],
        );
      }
    }
    return null;
  }

  parseFunctionNode(): FunctionNode | null {
    const func = this.match(tokenTypesList.get('FUNCTION') as TokenType);
    if (func) {
      const leftPar = this.match(tokenTypesList.get('LPAR') as TokenType);
      if (leftPar) {
        const isBracketsEmpty = !!this.match(
          tokenTypesList.get('RPAR') as TokenType,
        );
        if (isBracketsEmpty) {
          return new FunctionNode(func, func.text.toUpperCase(), []);
        }
        const args = this.parseEnumeratedElems();
        this.require(tokenTypesList.get('RPAR') as TokenType);
        return new FunctionNode(func, func.text.toUpperCase(), args);
      }
      FormulaError.expectedFunctionArguments(this.pos);
    }
    return null;
  }

  parseEnumeratedElems(): ExpressionNode[] {
    const result = [];
    let currentNode = this.parseFormula();
    if (!currentNode) {
      return [];
    }

    result.push(currentNode);

    let virgule = this.match(tokenTypesList.get('VIRGULE') as TokenType);
    while (virgule) {
      currentNode = this.parseFormula();
      result.push(currentNode);
      virgule = this.match(tokenTypesList.get('VIRGULE') as TokenType);
    }

    return result;
  }

  parseFormula(minPrecedence = 0): ExpressionNode {
    let leftNode = this.getCurrentNode();
    let operator = this.match(...tokenTypesBinOperations);
    let rightNode;

    while (operator) {
      const precedence = operatorPrecedence[operator.token.name];
      if (precedence < minPrecedence) {
        this.pos -= 1;
        break;
      }

      rightNode = this.parseFormula(precedence);
      leftNode = new BinOperationNode(operator, leftNode, rightNode);
      operator = this.match(...tokenTypesBinOperations);
    }

    return leftNode;
  }

  match(...expected: TokenType[]): Token | null {
    if (this.pos < this.tokens.length) {
      const currentToken = this.tokens[this.pos];

      if (expected.find((i) => i.name === currentToken.token.name)) {
        this.pos += 1;
        return currentToken;
      }
    }

    return null;
  }

  require(...expected: TokenType[]): Token {
    const token = this.match(...expected);
    if (!token) {
      FormulaError.missingRequiredConstruction(this.pos, expected[0].name);
    }
    return token;
  }

  // == PREPARE TO NEEDED FORMAT (JS | SQL) ==

  stringifyAst(
    { node, format, safe, values, bpiumValues }: StringifyArgs,
    // FIXME: any type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any {
    for (const [NodeType, stringify] of this.possibleStringifiers) {
      if (node instanceof NodeType) {
        return stringify({
          // FIXME: any type
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          node: node as any,
          format,
          safe,
          values,
          bpiumValues,
        });
      }
    }

    FormulaError.syntaxError(node.start);
  }

  private stringifyStatementsNode({
    node,
    format,
    safe,
    values,
    bpiumValues,
  }: StringifyArgs & { node: StatementsNode }) {
    return node.codeStrings.map(
      (i) =>
        `${this.stringifyAst({ node: i, format, safe, values, bpiumValues })}`,
    );
  }

  private stringifyNumberNode({
    node,
    format,
    safe,
    values,
    bpiumValues,
  }: StringifyArgs & { node: NumberNode }) {
    return node.number.text;
  }

  private stringifyLiteralNode({
    node,
    format,
    safe,
    values,
    bpiumValues,
  }: StringifyArgs & { node: LiteralNode }) {
    // replace brackets around format stringify
    if (format === FORMATS.SQL) {
      return `'${node.literal.text.slice(1, -1)}'`;
    }
    return `${node.literal.text.replace(/\\/g, '\\\\')}`;
  }

  private stringifyBooleanNode({
    node,
    format,
    safe,
    values,
    bpiumValues,
  }: StringifyArgs & { node: BooleanNode }) {
    return node.keyword.text;
  }

  private stringifyVariableNode({
    node,
    format,
    safe,
    values,
    bpiumValues,
  }: StringifyArgs & { node: VariableNode }) {
    const globalVarKey = removePrefixSuffix(node.variable.text);

    if (this.variables[globalVarKey]) {
      const sendedVar = this.variables[globalVarKey];
      let variableType = sendedVar.type;
      variableType =
        typesMapper[variableType as keyof typeof typesMapper] || variableType;

      const defaultValue = defaultValues[format][variableType];

      if (format === FORMATS.JS) {
        const preparedVar = `$$VARIABLES['${globalVarKey}']`;

        if (defaultValue === undefined) {
          return preparedVar;
        }

        return `(${preparedVar} === null ? ${defaultValue}: ${preparedVar})`;
      } else {
        if (!values) {
          FormulaError.requiredParamsError(['values']);
        }

        const value = values[globalVarKey];
        if (value === undefined) {
          FormulaError.missingVarsInValues([globalVarKey]);
        }
        const preparedValue = this.prepareVariableValue(value);

        if (defaultValue === undefined) {
          return String(preparedValue);
        }

        return `COALESCE(${preparedValue}, ${defaultValue})`;
      }
    }

    FormulaError.fieldNotFoundError(node.start, node.variable.text);
  }

  private stringifyParenthesizedNode({
    node,
    format,
    safe,
    values,
    bpiumValues,
  }: StringifyArgs & { node: ParenthesizedNode }) {
    return `(${this.stringifyAst({ node: node.expression, format, safe, values, bpiumValues })})`;
  }

  private stringifyArrayNode({
    node,
    format,
    safe,
    values,
    bpiumValues,
  }: StringifyArgs & { node: ArrayNode }) {
    const elems = node.elements;
    const [operatorType] = this.getReturnType(node);
    if (operatorType.has(UNKNOWN_NODE_TYPE)) {
      FormulaError.unexpectedArrayDataType(node.start);
    }

    const stringifiedElems = `[${elems.map((i) => this.stringifyAst({ node: i, format, safe, values, bpiumValues }))}]`;
    if (format === FORMATS.JS) {
      return stringifiedElems;
    }

    return `ARRAY${stringifiedElems}`;
  }

  private stringifyUnarOperationNode({
    node,
    format,
    safe,
    values,
    bpiumValues,
  }: StringifyArgs & { node: UnarOperationNode }) {
    const operator =
      allUnarOperators[node.operator.token.name as ValidUnarOperatorsNames];
    const [operatorType] = this.getReturnType(node);

    const operand = this.stringifyAst({
      node: node.operand,
      format,
      safe,
      values,
      bpiumValues,
    });
    const preparedOperator = operator[`${format}Fn`](operand);

    const isPolymorphic = operator.types.length === 0;
    if (isPolymorphic) {
      return preparedOperator;
    }

    let isOperandValid = false;

    operatorType.forEach((i) => {
      if (operator.types.find((j) => j === i)) {
        isOperandValid = true;
      }
    });

    if (isOperandValid) {
      return preparedOperator;
    }

    FormulaError.unexpectedDataType(node.operand.start, node.operator.text);
  }

  private stringifyBinOperationNode({
    node,
    format,
    safe,
    values,
    bpiumValues,
  }: StringifyArgs & { node: BinOperationNode }) {
    const operator =
      allBinOperators[node.operator.token.name as ValidBinOperatorsNames];
    const [operatorType, index] = this.getReturnType(node);

    const leftNode = this.stringifyAst({
      node: node.left,
      format,
      safe,
      values,
      bpiumValues,
    });
    const rightNode = this.stringifyAst({
      node: node.right,
      format,
      safe,
      values,
      bpiumValues,
    });

    if (operatorType.has(UNKNOWN_NODE_TYPE) || index === undefined) {
      FormulaError.unexpectedDataType(node.operator.pos, node.operator.text);
    }

    const neededOperator = operator[index];

    if (isSafeOperator(neededOperator) && safe) {
      const safeFn = neededOperator[`${format}SafeFn`];
      return safeFn(leftNode, rightNode);
    } else {
      const fn = neededOperator[`${format}Fn`];
      return fn(leftNode, rightNode);
    }
  }

  private stringifyIfStatementNode({
    node,
    format,
    safe,
    values,
    bpiumValues,
  }: StringifyArgs & { node: IfStatementNode }) {
    const [testType] = this.getReturnType(node.test);
    if (testType.size !== 1 || !testType.has(BOOLEAN_NODE_TYPE)) {
      FormulaError.invalidIfCondition(node.start);
    }

    const [consequentType] = this.getReturnType(node.consequent);
    const [alternateType] = this.getReturnType(node.alternate);

    const test = this.stringifyAst({
      node: node.test,
      format,
      safe,
      values,
      bpiumValues,
    });
    const consequent = this.stringifyAst({
      node: node.consequent,
      format,
      safe,
      values,
      bpiumValues,
    });
    const alternate = this.stringifyAst({
      node: node.alternate,
      format,
      safe,
      values,
      bpiumValues,
    });
    if (consequentType.size !== 1 || alternateType.size !== 1) {
      FormulaError.invalidIfStatement(node.start);
    }

    const preparedConsequentType = Array.from(consequentType)[0];
    const preparedAlternateType = Array.from(alternateType)[0];
    const formatHandler = ifStatementMap[`${format}Fn`];

    if (
      preparedAlternateType.endsWith(ARRAY_NODE_TYPE) &&
      preparedConsequentType.endsWith(ARRAY_NODE_TYPE)
    ) {
      if (preparedAlternateType === preparedConsequentType) {
        return formatHandler(test, consequent, alternate, undefined, true);
      }
      FormulaError.invalidIfStatement(node.start);
    }

    // this hack work because only in one case we expect if is not in the return type cache,
    // this is when in formula is only if (example: IF(1 > 2, 1, 2)), in this case we expect it to be cast correctly above
    const hasTypeInCache = this.getCachedReturnType(node.start, node.end);
    if (!hasTypeInCache) {
      return formatHandler(test, consequent, alternate);
    }

    const type = ifTypesMapper[preparedAlternateType + preparedConsequentType];
    if (!type) {
      FormulaError.invalidIfStatement(node.start);
    }

    let resultType;
    if (format === FORMATS.JS) {
      resultType = typesMapperJs[type];
    } else {
      resultType = typesMapperSql[type];
    }
    return formatHandler(test, consequent, alternate, resultType);
  }

  private stringifyFunctionNode({
    node,
    format,
    safe,
    values,
    bpiumValues,
  }: StringifyArgs & { node: FunctionNode }) {
    // may use as, because next stroke check valid func
    const currentFunction = allFunctions[node.name as ValidFunctionsNames];
    if (currentFunction) {
      const [nodeReturnType, idx] = this.getReturnType(node);

      if (nodeReturnType.has(UNKNOWN_NODE_TYPE) || idx === undefined) {
        FormulaError.unexpectedDataType(node.func.pos, node.name);
      }

      const functionArgs: string[] = node.args.map((arg) =>
        this.stringifyAst({ node: arg, format, safe, values, bpiumValues }),
      );
      const neededFunc = currentFunction[idx];
      const requiredArgsCount = neededFunc.args.filter(
        (i) => i.required === true || i.required === undefined,
      );
      if (requiredArgsCount.length > node.args.length) {
        FormulaError.invalidArgumentsCount(node.start, node.name);
      }

      if (isSafeFunction(neededFunc) && safe) {
        const safeFn = neededFunc[`${format}SafeFn`];
        return safeFn(functionArgs, bpiumValues);
      } else {
        const fn = neededFunc[`${format}Fn`];
        return fn(functionArgs, bpiumValues);
      }
    }
    FormulaError.invalidFunction(node.func.pos, node.name);
  }

  // TODO: support inserting strings as values
  prepareVariableValue = (value: unknown) => {
    // it is assumed that these will be columns from the database
    if (typeof value === 'string') {
      return `"${value}"`;
    }
    return value;
  };

  // == TYPE CHECK ==

  // TODO: this func need refactor, in every condition block we repeat code: setReturnType, return res ...
  // return all possible return types
  // for binary operator and funcs operators we return index which founds coincidence
  getReturnType(
    node: ExpressionNode,
    ctx?: ExpressionNode,
    position?: string,
  ): INodeReturnType {
    const typeFromCache = this.getCachedReturnType(node.start, node.end);
    if (typeFromCache) {
      return typeFromCache;
    }
    for (const [NodeType, getter] of this.possibleTypesGetters) {
      if (node instanceof NodeType) {
        return getter({
          // FIXME: any type
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          node: node as any,
          ctx,
          position,
        });
      }
    }

    const res: INodeReturnType = [new Set([UNKNOWN_NODE_TYPE])];
    this.setReturnTypeInCache(res, node.start, node.end);
    return res;
  }

  private getPrimitiveReturnType({
    node,
    ctx,
    position,
  }: GetReturnTypeArgs<
    LiteralNode | BooleanNode | NumberNode
  >): INodeReturnType {
    const result = this.prepareReturnType(node.type);
    return result;
  }

  private getVariableReturnType({
    node,
    ctx,
    position,
  }: GetReturnTypeArgs<VariableNode>): INodeReturnType {
    const globalVarKey = removePrefixSuffix(node.variable.text);
    // some variables we need to prevent for some knowing types, like progress, stars and etc.
    let variableType = this.variables[globalVarKey]?.type;
    variableType =
      typesMapper[variableType as keyof typeof typesMapper] || variableType;

    if (variableType) {
      return this.prepareReturnType(variableType);
    }
    return this.prepareReturnType(UNKNOWN_NODE_TYPE);
  }

  private getArrayReturnType({
    node,
    ctx,
    position,
  }: GetReturnTypeArgs<ArrayNode>): INodeReturnType {
    const elementsTypes = node.elements.map((i) => this.getReturnType(i));

    const [resultSet] = [new Set<string>()];
    elementsTypes.forEach(([returnType]) => {
      const returnTypeArr = Array.from(returnType);
      for (const variant of returnTypeArr) {
        resultSet.add(variant);
      }
    });

    if (resultSet.size === 1) {
      const type = Array.from(resultSet)[0];
      let preparedType;
      if (type.includes(NESTED_ARRAY_NODE_TYPE)) {
        preparedType = type;
      } else if (type.includes(ARRAY_NODE_TYPE)) {
        preparedType = type.replace(ARRAY_NODE_TYPE, NESTED_ARRAY_NODE_TYPE);
      } else {
        preparedType = type + ARRAY_NODE_TYPE;
      }

      const res = this.prepareReturnType(preparedType);
      this.setReturnTypeInCache(res, node.start, node.end);
      return res;
    }

    const res = this.prepareReturnType(UNKNOWN_NODE_TYPE);
    this.setReturnTypeInCache(res, node.start, node.end);
    return res;
  }

  private getParenthesizedReturnType({
    node,
    ctx,
    position,
  }: GetReturnTypeArgs<ParenthesizedNode>): INodeReturnType {
    const res = this.getReturnType(node.expression);
    this.setReturnTypeInCache(res, node.start, node.end);
    return res;
  }

  private getUnarReturnType({
    node,
    ctx,
    position,
  }: GetReturnTypeArgs<UnarOperationNode>): INodeReturnType {
    const res = this.getReturnType(node.operand, node);
    this.setReturnTypeInCache(res, node.start, node.end);
    return res;
  }

  private getBinReturnType({
    node,
    ctx,
    position,
  }: GetReturnTypeArgs<BinOperationNode>): INodeReturnType {
    const operator =
      allBinOperators[node.operator.token.name as ValidBinOperatorsNames];

    if (!operator) {
      const res = this.prepareReturnType(UNKNOWN_NODE_TYPE);
      this.setReturnTypeInCache(res, node.start, node.end);
      return res;
    }

    const [leftNodeType] = this.getReturnType(node.left, node);
    const [rightNodeType] = this.getReturnType(node.right, node);

    if (
      leftNodeType.has(UNKNOWN_NODE_TYPE) ||
      rightNodeType.has(UNKNOWN_NODE_TYPE)
    ) {
      const res = this.prepareReturnType(UNKNOWN_NODE_TYPE);
      this.setReturnTypeInCache(res, node.start, node.end);
      return res;
    }

    for (let i = 0; i < operator.length; i++) {
      const returnTypeVariant = operator[i].returnType;
      const neededTypeVariant = operator[i].operandType;

      // operandtype = null means that operands may be any types but this types should be equality
      const isPolymorphic = neededTypeVariant === null;
      const isLeftMonomorphic = leftNodeType.size === 1;
      const isRightMonomorphic = rightNodeType.size === 1;

      if (isPolymorphic && isLeftMonomorphic && isRightMonomorphic) {
        const res = this.prepareReturnType(returnTypeVariant, i);
        this.setReturnTypeInCache(res, node.start, node.end);
        return res;
      }
      if (!isPolymorphic && isLeftMonomorphic && isRightMonomorphic) {
        const isNeededTypeArray = Array.isArray(neededTypeVariant);

        if (
          !isNeededTypeArray &&
          leftNodeType.has(neededTypeVariant) &&
          rightNodeType.has(neededTypeVariant)
        ) {
          const res = this.prepareReturnType(returnTypeVariant, i);
          this.setReturnTypeInCache(res, node.start, node.end);
          return res;
        }
        if (isNeededTypeArray) {
          let coincidence = 0;
          neededTypeVariant.forEach((curType) => {
            if (leftNodeType.has(curType)) {
              coincidence++;
            }
            if (rightNodeType.has(curType)) {
              coincidence++;
            }
          });
          if (coincidence === 2) {
            const res = this.prepareReturnType(returnTypeVariant, i);
            this.setReturnTypeInCache(res, node.start, node.end);
            return res;
          }
        }
      }
    }
    const res: INodeReturnType = [new Set([UNKNOWN_NODE_TYPE])];
    this.setReturnTypeInCache(res, node.start, node.end);
    return res;
  }

  private getIfReturnType({
    node,
    ctx,
    position,
  }: GetReturnTypeArgs<IfStatementNode>): INodeReturnType {
    const [consequentType, idx] = this.getReturnType(
      node.consequent,
      node,
      'consequent',
    );
    const [alternateType] = this.getReturnType(
      node.alternate,
      node,
      'alternate',
    );

    const isConsequentPolymorphic = consequentType.size === 1;
    const isAlternatePolymorphic = alternateType.size === 1;

    const preparedConsequentType = Array.from(consequentType)[0];
    const preparedAlternateType = Array.from(alternateType)[0];

    if (
      isConsequentPolymorphic &&
      isAlternatePolymorphic &&
      preparedConsequentType !== preparedAlternateType
    ) {
      if (ctx instanceof UnarOperationNode) {
        const operator =
          allUnarOperators[ctx.operator.token.name as ValidUnarOperatorsNames];
        const neededTypes = operator.types;

        const key = preparedConsequentType + preparedAlternateType;
        if (key in ifTypesMapper) {
          const type = ifTypesMapper[key];
          if (type && neededTypes.includes(type as NodeTypesValues)) {
            const res = this.prepareReturnType(type);
            this.setReturnTypeInCache(res, node.start, node.end);
            return res;
          }
        }
      }
      if (ctx instanceof IfStatementNode) {
        let oneArgType;
        if (position === 'alternate') {
          [oneArgType] = this.getReturnType(ctx.consequent, node, 'consequent');
        } else {
          [oneArgType] = this.getReturnType(ctx.alternate, node, 'alternate');
        }

        const isArgPolymorphic = oneArgType.size === 1;

        if (isArgPolymorphic) {
          const preparedArgType = Array.from(oneArgType)[0];

          const key =
            preparedArgType +
            ifTypesMapper[preparedConsequentType + preparedAlternateType];
          if (key in ifTypesMapper) {
            const type = ifTypesMapper[key];
            if (type) {
              const res = this.prepareReturnType(type);
              this.setReturnTypeInCache(res, node.start, node.end);
              return res;
            }
          }
        }
      }
      if (ctx instanceof BinOperationNode) {
        const parent =
          allBinOperators[ctx.operator.token.name as ValidBinOperatorsNames];
        for (const parentVariant of parent) {
          const parentVariantTypes = parentVariant.operandType;
          const isVariantPolymorphic = parentVariantTypes === null;

          if (isVariantPolymorphic) {
            break;
          }

          const isVariantTypesArray = Array.isArray(parentVariantTypes);
          if (isVariantTypesArray) {
            let coincidence = 0;
            let possibleConsequentType = '';
            let possibleAlternateType = '';
            for (let i = 0; i < parentVariantTypes.length; i++) {
              const currentVariantType = parentVariantTypes[i];

              if (consequentType.has(currentVariantType)) {
                coincidence++;
                possibleConsequentType = currentVariantType;
              }
              if (alternateType.has(currentVariantType)) {
                coincidence++;
                possibleAlternateType = currentVariantType;
              }
              if (coincidence >= 1) {
                const key = possibleConsequentType + possibleAlternateType;
                if (key in ifTypesMapper) {
                  const type = ifTypesMapper[key];
                  if (type) {
                    const res = this.prepareReturnType(type);
                    this.setReturnTypeInCache(res, node.start, node.end);
                    return res;
                  }
                }
              }
            }
          }
        }
      }
      if (ctx instanceof FunctionNode) {
        const parent = allFunctions[ctx.func.text as ValidFunctionsNames];

        for (const parentVariant of parent) {
          const idx = Number(position);
          if (Number.isNaN(idx)) {
            if (process.env.NODE_ENV === 'development') {
              throw new Error('Position should be number!!!');
            }
            break;
          }
          const arg = parentVariant.args[idx];
          const argType = arg.type;
          const canArgBeLast = parentVariant.args.length - 1 <= idx;

          if (argType) {
            const key = preparedConsequentType + preparedAlternateType;
            if (key in ifTypesMapper) {
              const type = ifTypesMapper[key];
              if (type) {
                if (argType.includes(type as NodeTypesValues)) {
                  const res = this.prepareReturnType(type);
                  this.setReturnTypeInCache(res, node.start, node.end);
                  return res;
                }
              }
            }
          }
          if (arg.many && canArgBeLast) {
            const key = preparedConsequentType + preparedAlternateType;
            if (key in ifTypesMapper) {
              const type = ifTypesMapper[key];
              if (type) {
                const includesLastArgNeededType = parentVariant.args[
                  parentVariant.args.length - 1
                ].type.includes(type as NodeTypesValues);

                if (includesLastArgNeededType) {
                  const res = this.prepareReturnType(type);
                  this.setReturnTypeInCache(res, node.start, node.end);
                  return res;
                }
              }
            }
          }
        }
      }
    }

    alternateType.forEach((i) => consequentType.add(i));
    this.setReturnTypeInCache([consequentType, idx], node.start, node.end);
    return [consequentType, idx];
  }

  private getFunctionReturnType({
    node,
    ctx,
    position,
  }: GetReturnTypeArgs<FunctionNode>): INodeReturnType {
    const currentFunction = allFunctions[node.name as ValidFunctionsNames];

    if (!currentFunction) {
      const res = this.prepareReturnType(UNKNOWN_NODE_TYPE);
      this.setReturnTypeInCache(res, node.start, node.end);
      return res;
    }

    // empty args array means func does not accept any arguments
    if (node.args.length === 0 && currentFunction[0].args.length === 0) {
      const res: INodeReturnType = [new Set(currentFunction[0].returnType), 0];
      this.setReturnTypeInCache(res, node.start, node.end);
      return res;
    }

    // get all types for node args
    const nodeArgs: [Set<string>, number?][] = [];
    for (let i = 0; i < node.args.length; i++) {
      const argType = this.getReturnType(node.args[i], node, String(i));
      if (!argType[0].has(UNKNOWN_NODE_TYPE)) {
        nodeArgs.push(argType);
      } else {
        const res = this.prepareReturnType(UNKNOWN_NODE_TYPE);
        this.setReturnTypeInCache(res, node.start, node.end);
        return res;
      }
    }

    // compare the data types of the node and possible implementations of this function
    for (let i = 0; i < currentFunction.length; i++) {
      let coincidences = 0;
      const functionVariant = currentFunction[i];
      const functionVariantReturnType = functionVariant.returnType;
      const functionVariantArgs = functionVariant.args;
      const lastArgType =
        functionVariantArgs[functionVariantArgs.length - 1]?.type;
      const isLastArgMany =
        functionVariantArgs[functionVariantArgs.length - 1]?.many || false;

      if (nodeArgs.length === 0 && functionVariantArgs.length !== 0) {
        break;
      }
      // in a loop we go through all the arguments of the node
      for (let j = 0; j < nodeArgs.length; j++) {
        const canArgBeLast = functionVariantArgs.length - 1 <= j;
        const nodeArgType = nodeArgs[j][0];
        let argVariantsCoincidence = 0;
        // may be undefined in case with arg which can be many
        const functionVariantCurrentArg = functionVariantArgs[j];
        if (functionVariantCurrentArg) {
          functionVariantCurrentArg.type.forEach((possibleArgType) => {
            if (nodeArgType.has(possibleArgType)) {
              argVariantsCoincidence++;
            }
          });
          if (
            argVariantsCoincidence <= functionVariantCurrentArg.type.length &&
            ((argVariantsCoincidence !== 0 &&
              argVariantsCoincidence === nodeArgType.size) ||
              (argVariantsCoincidence === 0 &&
                functionVariantCurrentArg.type.length === 0))
          ) {
            coincidences++;
          }
        } else {
          if (lastArgType) {
            lastArgType.forEach((possibleArgType) => {
              if (
                nodeArgType.has(possibleArgType) &&
                canArgBeLast &&
                lastArgType &&
                isLastArgMany
              ) {
                argVariantsCoincidence++;
              }
            });
            if (
              argVariantsCoincidence <= lastArgType.length &&
              ((argVariantsCoincidence !== 0 &&
                argVariantsCoincidence === nodeArgType.size) ||
                (argVariantsCoincidence === 0 &&
                  lastArgType.length === 0 &&
                  canArgBeLast &&
                  lastArgType &&
                  isLastArgMany))
            ) {
              coincidences++;
            }
          }
        }
      }
      if (coincidences === nodeArgs.length) {
        const res: INodeReturnType = [new Set(functionVariantReturnType), i];
        this.setReturnTypeInCache(res, node.start, node.end);
        return res;
      }
    }

    const res: INodeReturnType = [new Set([UNKNOWN_NODE_TYPE])];
    this.setReturnTypeInCache(res, node.start, node.end);
    return res;
  }

  prepareReturnType(type: string, idx?: number): INodeReturnType {
    return [new Set([type]), idx];
  }

  // == VARIABLES HANDLERS ==

  // TODO: need to be taken out traverse
  // only map variables. it is supposed to be used before conversion to js or sql
  mapIdentifiers(
    node: ExpressionNode,
    {
      from,
      to,
    }: { from?: keyof IVar | (keyof IVar)[]; to: keyof IVar | (keyof IVar)[] },
  ): string | string[] {
    const variables = Object.values(this.variables);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const traverse = (n: ExpressionNode): any => {
      let result = '';
      if (n.leftSpaces) {
        n.leftSpaces.forEach((i) => (result += i.space.text));
      }

      if (n instanceof NumberNode) {
        result += n.number.text;
      } else if (n instanceof LiteralNode) {
        result += n.literal.text;
      } else if (n instanceof BooleanNode) {
        result += n.keyword.text;
      } else if (n instanceof VariableNode) {
        const varKey = removePrefixSuffix(n.variable.text);

        let variable;

        if (from) {
          variable = variables.find(
            (v) =>
              v &&
              (Array.isArray(from)
                ? from.find((f) => v[f] === varKey)
                : v[from] == varKey),
          );
        } else {
          variable = this.variables[varKey];
        }

        if (!variable) {
          FormulaError.mapIdsFromError(varKey);
        }

        const executedVar = Array.isArray(to)
          ? variable[to.find((t) => variable[t]) ?? '']
          : variable[to];
        if (!executedVar) {
          FormulaError.mapIdsToError(varKey, to);
        }

        result += `${FORMULA_TEMPLATES.PREFIX}${executedVar}${FORMULA_TEMPLATES.POSTFIX}`;
      } else if (n instanceof ParenthesizedNode) {
        result += `(${traverse(n.expression)})`;
      } else if (n instanceof UnarOperationNode) {
        result += `${n.operator.text}${traverse(n.operand)}`;
      } else if (n instanceof BinOperationNode) {
        result += `${traverse(n.left)}${n.operator.text}${traverse(n.right)}`;
      } else if (n instanceof ArrayNode) {
        result += `[${n.elements.map((i) => traverse(i))}]`;
      } else if (n instanceof IfStatementNode) {
        result += `${n.ifToken.text}(${traverse(n.test)},${traverse(n.consequent)},${traverse(n.alternate)})`;
      } else if (n instanceof FunctionNode) {
        result += `${n.func.text.toUpperCase()}(${n.args.map((i) => traverse(i))})`;
      } else if (n instanceof StatementsNode) {
        return n.codeStrings.map((i) => traverse(i));
      } else {
        FormulaError.impossibleMapIds();
      }

      if (n.rightSpaces) {
        n.rightSpaces.forEach((i) => (result += i.space.text));
      }

      return result;
    };
    return traverse(node);
  }

  _traverse<T extends ExpressionNode>(
    n: ExpressionNode,
    needed: NodeTypesValues,
    fn: (node: T) => unknown,
  ) {
    let cur = null;

    if (n instanceof LiteralNode) {
      cur = LITERAL_NODE_TYPE;
    }
    if (n instanceof NumberNode) {
      cur = NUMBER_NODE_TYPE;
    }
    if (n instanceof BooleanNode) {
      cur = BOOLEAN_NODE_TYPE;
    }
    if (n instanceof VariableNode) {
      cur = VARIABLE_NODE_TYPE;
    }
    if (n instanceof BinOperationNode) {
      cur = BIN_OPERATION_NODE_TYPE;
      this._traverse(n.left, needed, fn);
      this._traverse(n.right, needed, fn);
    } else if (n instanceof UnarOperationNode) {
      cur = UNAR_OPERATION_NODE_TYPE;
      this._traverse(n.operand, needed, fn);
    } else if (n instanceof ParenthesizedNode) {
      cur = PARENTHESIZED_NODE_TYPE;
      this._traverse(n.expression, needed, fn);
    } else if (n instanceof FunctionNode) {
      cur = FUNCTION_NODE_TYPE;
      n.args.forEach((arg) => this._traverse(arg, needed, fn));
    } else if (n instanceof IfStatementNode) {
      cur = IF_STATEMENT_NODE_TYPE;
      if (n.consequent) this._traverse(n.consequent, needed, fn);
      if (n.alternate) this._traverse(n.alternate, needed, fn);
      if (n.test) this._traverse(n.test, needed, fn);
    } else if (n instanceof StatementsNode) {
      cur = STATEMENTS_NODE_TYPE;
      n.codeStrings.forEach((arg) => this._traverse(arg, needed, fn));
    }

    if (cur === needed) {
      fn(n as T);
    }
  }

  getVariables(node: ExpressionNode): Set<string> {
    const variables = new Set<string>();
    const fn = (node: VariableNode) => {
      variables.add(removePrefixSuffix(node.variable.text));
    };

    this._traverse<VariableNode>(node, VARIABLE_NODE_TYPE, fn);

    return variables;
  }

  getFunctions(node: ExpressionNode): Set<string> {
    const functions = new Set<string>();
    const fn = (node: FunctionNode) => {
      functions.add(node.name.toUpperCase());
    };

    this._traverse(node, FUNCTION_NODE_TYPE, fn);

    return functions;
  }

  // == CACHE HELPERS ==

  getCachedReturnType(start: number, end: number): INodeReturnType {
    return this.returnTypesCache[`${start}${end}`];
  }

  setReturnTypeInCache(
    type: INodeReturnType,
    start: number,
    end: number,
  ): void {
    this.returnTypesCache[`${start}${end}`] = type;
  }
}
