// TODO: Refactor errors to use the error class from the lib/exceptions
import Token from '../Lexer/Token';
import TokenType, {
  tokenTypesBinOperations,
  tokenTypesKeywords,
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

import { allFunctions } from './functions';
import { binOperatorToSqlMap } from './binOperators/toSql';
import KeywordNode from '../AST/KeywordNode';
import { ValidFunctionsNames } from './functions/types';
import { FORMATS } from '../constants/formats';
import {
  KEYWORD_NODE_TYPE,
  LITERAL_NODE_TYPE,
  NODE_TYPES,
  NodeTypesValues,
  NUMBER_NODE_TYPE,
  UNKNOWN_NODE_TYPE,
  VARIABLE_NODE_TYPE,
} from '../constants/nodeTypes';
import { unarOperatorToSqlMap } from './unarOperators/toSql';

interface IVar {
  title: string;
  value: string;
  type: string;
}

export default class Parser {
  tokens: Token[];
  pos: number = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalVars: Record<string, any> = {};

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  initVars(variables: IVar[]): void {
    if (!variables) {
      return;
    }
    variables.forEach(
      (i) => (this.globalVars[i.title] = { value: i.value, type: i.type }),
    );
  }

  parseCode(): StatementsNode {
    const lastToken = this.tokens[this.tokens.length - 1];
    const statementEnd = lastToken.pos + lastToken.text.length;

    const root = new StatementsNode(statementEnd);

    while (this.pos < this.tokens.length) {
      const codeStringNode = this.parseExpression();
      // if we need make formula multiline, uncomment this string and add in tokens symbol, which mean end of line
      // this.require(СИМВОЛ_ОКОНЧАНИЯ_СТРОКИ)
      root.addNode(codeStringNode);
    }
    return root;
  }

  parseExpression(): ExpressionNode {
    const currentNode = this.getCurrentNode();

    const operator = this.match(...tokenTypesBinOperations);
    if (!operator) {
      return currentNode;
    }

    const rightNode = this.parseFormula();
    const binaryNode = new BinOperationNode(operator, currentNode, rightNode);

    return binaryNode;
  }

  getCurrentNode(): ExpressionNode {
    const parsersForPossibleResults = [
      this.parseLiteralNode,
      this.parseNumberNode,
      this.parseKeywordNode,
      this.parseVariableNode,
      this.parseUnarOperatorNode,
      this.parseParenthesizedNode,
      this.parseFunctionNode,
    ];

    for (const parseFn of parsersForPossibleResults) {
      // with call method typescript  gets confused
      const possibleResult = parseFn.bind(this)();
      if (possibleResult !== null) {
        return possibleResult;
      }
    }

    throw new Error(`Неожиданный синтаксис на ${this.pos}`);
  }

  parseLiteralNode(): LiteralNode | null {
    const string = this.match(tokenTypesList.STRING);
    if (string) {
      return new LiteralNode(string);
    }

    return null;
  }

  parseNumberNode(): NumberNode | null {
    const number = this.match(tokenTypesList.NUMBER);
    if (number) {
      return new NumberNode(number);
    }

    return null;
  }

  parseKeywordNode(): KeywordNode | null {
    const keyword = this.match(...tokenTypesKeywords);
    if (keyword) {
      return new KeywordNode(keyword);
    }

    return null;
  }

  parseVariableNode(): VariableNode | null {
    const variable = this.match(tokenTypesList.VARIABLE);
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
    const leftPar = this.match(tokenTypesList.LPAR);
    if (leftPar) {
      const node = this.parseFormula();
      this.require(tokenTypesList.RPAR);
      return new ParenthesizedNode(node);
    }

    return null;
  }

  parseFunctionNode(): FunctionNode | null {
    const func = this.match(tokenTypesList.FUNCTION);
    if (func) {
      const leftPar = this.match(tokenTypesList.LPAR);
      if (leftPar) {
        const isBracketsEmpty = !!this.match(tokenTypesList.RPAR);
        if (isBracketsEmpty) {
          return new FunctionNode(func, func.text, []);
        }
        const args = this.parseFunctionArgs();
        this.require(tokenTypesList.RPAR);
        return new FunctionNode(func, func.text, args);
      }
      throw new Error(
        `Ожидалось перечисление аргументов на позиции ${this.pos}`,
      );
    }
    return null;
  }

  parseFunctionArgs(): ExpressionNode[] {
    const result = [];
    let currentNode = this.parseFormula();
    if (!currentNode) {
      return [];
    }

    result.push(currentNode);

    let virgule = this.match(tokenTypesList.VIRGULE);
    while (virgule) {
      currentNode = this.parseFormula();
      result.push(currentNode);
      virgule = this.match(tokenTypesList.VIRGULE);
    }

    return result;
  }

  parseFormula(): ExpressionNode {
    let leftNode = this.getCurrentNode();
    let operator = this.match(...tokenTypesBinOperations);
    let rightNode;

    while (operator) {
      rightNode = this.parseFormula();
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
      throw new Error(`На позиции ${this.pos} ожидается ${expected[0].name}`);
    }
    return token;
  }

  getNodeType(node: ExpressionNode): Set<string> {
    if (node instanceof NumberNode) {
      return new Set([NUMBER_NODE_TYPE]);
    }
    if (node instanceof LiteralNode) {
      return new Set([LITERAL_NODE_TYPE]);
    }
    if (node instanceof KeywordNode) {
      return new Set([KEYWORD_NODE_TYPE]);
    }
    if (node instanceof VariableNode) {
      return new Set([VARIABLE_NODE_TYPE]);
    }
    if (node instanceof ParenthesizedNode) {
      return this.getNodeType(node.expression);
    }
    if (node instanceof UnarOperationNode) {
      return this.getNodeType(node.operand);
    }
    if (node instanceof BinOperationNode) {
      const leftNodeType = this.getNodeType(node.left);
      const rightNodeType = this.getNodeType(node.right);

      // right now we do operations with funcs that may returns different types impossible
      const possibleResults = [];
      leftNodeType.forEach((i) => {
        rightNodeType.forEach((j) => {
          if (i === j) {
            possibleResults.push(i);
          }
        });
      });

      if (
        possibleResults.length === 1 &&
        rightNodeType.size === 1 &&
        leftNodeType.size === 1
      ) {
        return leftNodeType;
      }

      return new Set([UNKNOWN_NODE_TYPE]);
    }
    if (node instanceof FunctionNode) {
      const currentFunction = allFunctions[node.name as ValidFunctionsNames];
      if (!currentFunction) {
        return new Set([UNKNOWN_NODE_TYPE]);
      }
      const possibleReturnTypes = currentFunction.map((i) => i.returnType);

      return new Set(possibleReturnTypes);
    }

    return new Set([UNKNOWN_NODE_TYPE]);
  }

  stringifyAst(
    node: ExpressionNode,
    format: (typeof FORMATS)[keyof typeof FORMATS],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any {
    if (node instanceof StatementsNode) {
      return node.codeStrings.map((i) => this.stringifyAst(i, format));
    }
    if (node instanceof NumberNode) {
      return node.number.text;
    }
    if (node instanceof LiteralNode) {
      if (format === FORMATS.SQL) {
        return `'${node.literal.text.slice(1, -1)}'`;
      }
      return `${node.literal.text}`;
    }
    if (node instanceof KeywordNode) {
      return node.keyword.text;
    }
    if (node instanceof VariableNode) {
      if (this.globalVars[node.variable.text]) {
        if (format === FORMATS.JS) {
          return `VARIABLES.$${this.globalVars[node.variable.text].value}`;
        } else {
          return `$${this.globalVars[node.variable.text].value}`;
        }
      }
      throw new Error(
        `Недопустимая переменная ${node.variable.text} на позиции ${node.start}`,
      );
    }
    if (node instanceof ParenthesizedNode) {
      return `(${this.stringifyAst(node.expression, format)})`;
    }
    if (node instanceof UnarOperationNode) {
      // maybe need type check!!!
      if (format === FORMATS.SQL) {
        return `${unarOperatorToSqlMap[node.operator.token.name] || node.operator.text} ${this.stringifyAst(node.operand, format)}`;
      } else {
        return `${node.operator.text} ${this.stringifyAst(node.operand, format)}`;
      }
    }
    if (node instanceof BinOperationNode) {
      const nodeType = this.getNodeType(node);
      if (nodeType.has(UNKNOWN_NODE_TYPE)) {
        throw new Error(
          `Неожиданный тип данных при ${node.operator.text} на позиции ${node.right.start}`,
        );
      }

      const operator =
        binOperatorToSqlMap[node.operator.token.name] || node.operator.text;
      const leftNode = this.stringifyAst(node.left, format);
      const rightNode = this.stringifyAst(node.right, format);
      return `${leftNode} ${operator} ${rightNode}`;
    }
    if (node instanceof FunctionNode) {
      // may use as, because next stroke check valid func
      const currentFunction = allFunctions[node.name as ValidFunctionsNames];
      if (currentFunction) {
        for (let i = 0; i < currentFunction.length; i++) {
          const currentFunctionVariation = currentFunction[i];
          // const sqlFunctionAnalog = sqlFunctionsMap[node.name];
          try {
            if (
              node.args.length === 0 &&
              currentFunctionVariation.args.length !== 0
            ) {
              throw new Error(
                `В функцию ${node.name} на позиции ${node.start} нужно добавить аргумент типа ${currentFunctionVariation.args[0].type}`,
              );
            }
            const functionArgs = node.args.map((arg, index) => {
              if (currentFunctionVariation.args.length === 0) {
                throw new Error(
                  `Функция ${node.name} не принимает никаких аргументов на позиции ${arg.start}`,
                );
              }
              const neededArgType = currentFunctionVariation.args[index]?.type;
              const argType = arg.type;
              const argNode = this.stringifyAst(arg, format);

              const lastArgType =
                currentFunctionVariation.args[
                  currentFunctionVariation.args.length - 1
                ].type;
              const canArgBeLast =
                currentFunctionVariation.args.length - 1 <= index;
              const isMany =
                currentFunctionVariation.args[
                  currentFunctionVariation.args.length - 1
                ].many;

              // i don't know how work in different situations
              if (Array.isArray(neededArgType)) {
                for (const argVariant of neededArgType) {
                  if (
                    argVariant === argType ||
                    (argType === lastArgType && canArgBeLast && isMany)
                  ) {
                    return argNode;
                  }
                }
              } else if (Array.isArray(lastArgType)) {
                for (const argVariant of lastArgType) {
                  if (argVariant === argType) {
                    return argNode;
                  }
                }
              } else {
                if (
                  argType === neededArgType ||
                  (argType === lastArgType && canArgBeLast && isMany)
                ) {
                  return argNode;
                }
              }

              if (arg instanceof VariableNode) {
                const variableType = this.globalVars[arg.variable.text].type;
                if (
                  neededArgType === variableType
                  // || lastArgType === variableType
                ) {
                  return argNode;
                }
              }

              if (arg instanceof ParenthesizedNode) {
                const operationResultType = this.getNodeType(arg);
                if (operationResultType.has(UNKNOWN_NODE_TYPE)) {
                  throw new Error(
                    `Неизвестный возвращаемый тип на позиции ${arg.start}`,
                  );
                }

                let concidences = 0;
                if (Array.isArray(neededArgType)) {
                  for (const argVariant of neededArgType) {
                    if (operationResultType.has(argVariant)) {
                      if (operationResultType.size === 1) {
                        return argNode;
                      } else {
                        concidences++;
                      }
                    }
                  }
                  if (
                    concidences === neededArgType.length &&
                    concidences === operationResultType.size
                  ) {
                    return argNode;
                  }
                } else if (Array.isArray(lastArgType)) {
                  for (const argVariant of lastArgType) {
                    if (operationResultType.has(argVariant)) {
                      if (operationResultType.size === 1) {
                        return argNode;
                      } else {
                        concidences++;
                      }
                    }
                  }
                  if (
                    concidences === lastArgType.length &&
                    concidences === operationResultType.size
                  ) {
                    return argNode;
                  }
                } else {
                  if (
                    (operationResultType.has(neededArgType) ||
                      (operationResultType.has(lastArgType) &&
                        canArgBeLast &&
                        isMany)) &&
                    operationResultType.size === 1
                  ) {
                    return argNode;
                  }
                }
              }

              if (arg instanceof BinOperationNode) {
                const operationResultType = this.getNodeType(arg);
                if (operationResultType.has(UNKNOWN_NODE_TYPE)) {
                  throw new Error(
                    `Неизвестный возвращаемый тип на позиции ${arg.start}`,
                  );
                }

                let concidences = 0;
                if (Array.isArray(neededArgType)) {
                  for (const argVariant of neededArgType) {
                    if (operationResultType.has(argVariant)) {
                      if (operationResultType.size === 1) {
                        return argNode;
                      } else {
                        concidences++;
                      }
                    }
                  }
                  if (
                    concidences === neededArgType.length &&
                    concidences === operationResultType.size
                  ) {
                    return argNode;
                  }
                } else if (Array.isArray(lastArgType)) {
                  for (const argVariant of lastArgType) {
                    if (operationResultType.has(argVariant)) {
                      if (operationResultType.size === 1) {
                        return argNode;
                      } else {
                        concidences++;
                      }
                    }
                  }
                  if (
                    concidences === lastArgType.length &&
                    concidences === operationResultType.size
                  ) {
                    return argNode;
                  }
                } else {
                  if (
                    (operationResultType.has(neededArgType) ||
                      (operationResultType.has(lastArgType) &&
                        canArgBeLast &&
                        isMany)) &&
                    operationResultType.size === 1
                  ) {
                    return argNode;
                  }
                }
              }

              if (arg instanceof FunctionNode) {
                // may use as, because next stroke check valid func
                const functionInArg =
                  allFunctions[arg.name as ValidFunctionsNames];
                if (!functionInArg) {
                  throw new Error(
                    `Недопустимое имя функции ${arg.name} на позиции ${arg.func.pos}`,
                  );
                }
                for (let i = 0; i < functionInArg.length; i++) {
                  const currentFunctionInArgVariation = functionInArg[i];

                  try {
                    if (Array.isArray(neededArgType)) {
                      for (const argVariant of neededArgType) {
                        if (
                          argVariant ===
                            currentFunctionInArgVariation.returnType ||
                          (currentFunctionInArgVariation.returnType ===
                            lastArgType &&
                            canArgBeLast &&
                            isMany)
                        ) {
                          return this.stringifyAst(arg, format);
                        }
                      }
                    } else if (Array.isArray(lastArgType)) {
                      for (const argVariant of lastArgType) {
                        if (
                          argVariant ===
                          currentFunctionInArgVariation.returnType
                        ) {
                          return this.stringifyAst(arg, format);
                        }
                      }
                    } else {
                      if (
                        currentFunctionInArgVariation.returnType ===
                          neededArgType ||
                        (currentFunctionInArgVariation.returnType ===
                          lastArgType &&
                          canArgBeLast &&
                          isMany)
                      ) {
                        return this.stringifyAst(arg, format);
                      }
                    }

                    throw new Error(
                      `Функция ${arg.name} не может использоваться, как аргумент функции ${node.name}, так как возвращает ${currentFunctionInArgVariation.returnType} на позиции ${arg.start + 1}`,
                    );
                  } catch (e) {
                    if (e instanceof Error && i === functionInArg.length - 1) {
                      throw new Error(e.message);
                    }
                    throw new Error(`Непредвиденная ошибка ${e}`);
                  }
                }
              }

              throw new Error(
                `Неожиданный тип данных ${arg.type} в функции ${node.name} на позиции ${arg.start + 1}`,
              );
            });
            const res = currentFunctionVariation[`${format}Fn`](functionArgs);
            return res;
          } catch (e) {
            if (e instanceof Error && i === currentFunction.length - 1) {
              throw new Error(e.message);
            }
            throw new Error(`Непредвиденная ошибка ${e}`);
          }
        }
      }
      throw new Error(
        `Недопустимое имя функции ${node.name} на позиции ${node.func.pos}`,
      );
    }

    throw new Error(`Недопустимый синтаксис на позиции ${node.start}`);
  }
}
