// TODO: Refactor errors to use the error class from the lib/exceptions
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
import KeywordNode from '../AST/BooleanNode';
import IfStatementNode from '../AST/IfStatementNode';

import { allFunctions } from './mappers/functions';
import { ValidFunctionsNames } from './mappers/functions/types';
import { allUnarOperators } from './mappers/unarOperators';
import { ValidUnarOperatorsNames } from './mappers/unarOperators/types';
import { ifStatementMap } from './mappers/if';
import { allBinOperators } from './mappers/binOperators';
import { ValidBinOperatorsNames } from './mappers/binOperators/types';

import { FORMATS } from '../constants/formats';
import { NodeTypesValues, UNKNOWN_NODE_TYPE } from '../constants/nodeTypes';
import BooleandNode from '../AST/BooleanNode';

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
      this.parseIfStatementNode,
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
    const string = this.match(tokenTypesList.get('STRING') as TokenType);
    if (string) {
      return new LiteralNode(string);
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

  parseKeywordNode(): KeywordNode | null {
    const keyword = this.match(...tokenTypesBoolean);
    if (keyword) {
      return new KeywordNode(keyword);
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

  parseIfStatementNode(): IfStatementNode | null {
    const ifStatement = this.match(tokenTypesList.get('IF') as TokenType);
    if (ifStatement) {
      const leftPar = this.match(tokenTypesList.get('LPAR') as TokenType);
      if (leftPar) {
        const isBracketsEmpty = !!this.match(
          tokenTypesList.get('RPAR') as TokenType,
        );
        if (isBracketsEmpty) {
          throw new Error(
            `Пустой условный оператор на позиции ${ifStatement.pos}`,
          );
        }

        const result = [];
        let currentNode = this.parseFormula();
        if (currentNode) {
          result.push(currentNode);

          let virguleCount = 0;
          let virgule = this.match(tokenTypesList.get('VIRGULE') as TokenType);
          while (virgule) {
            if (virguleCount >= 2) {
              throw new Error(
                `Неожиданное количество аргументов на позиции ${virgule.pos + 1}`,
              );
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
          return new FunctionNode(func, func.text, []);
        }
        const args = this.parseFunctionArgs();
        this.require(tokenTypesList.get('RPAR') as TokenType);
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

    let virgule = this.match(tokenTypesList.get('VIRGULE') as TokenType);
    while (virgule) {
      currentNode = this.parseFormula();
      result.push(currentNode);
      virgule = this.match(tokenTypesList.get('VIRGULE') as TokenType);
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

  // TODO: add cache for elements that we have bypassed
  // return all possible return types
  // for binary operator and funcs operators we return index which founds coincidence
  getNodeReturnType(node: ExpressionNode): [Set<string>, number?] {
    if (
      node instanceof NumberNode ||
      node instanceof LiteralNode ||
      node instanceof BooleandNode
    ) {
      return [new Set([node.type])];
    }
    if (node instanceof VariableNode) {
      const variableType = this.globalVars[node.variable.text]?.type;
      if (variableType) {
        return [new Set([variableType])];
      }
      return [new Set([UNKNOWN_NODE_TYPE])];
    }
    if (node instanceof ParenthesizedNode) {
      return this.getNodeReturnType(node.expression);
    }
    if (node instanceof UnarOperationNode) {
      return this.getNodeReturnType(node.operand);
    }
    // For binary operator and funcs always returns [Set(...), idx]
    if (node instanceof BinOperationNode) {
      const operator =
        allBinOperators[node.operator.token.name as ValidBinOperatorsNames];
      if (!operator) {
        return [new Set([UNKNOWN_NODE_TYPE])];
      }

      const leftNodeType = this.getNodeReturnType(node.left)[0];
      const rightNodeType = this.getNodeReturnType(node.right)[0];

      if (
        leftNodeType.has(UNKNOWN_NODE_TYPE) ||
        rightNodeType.has(UNKNOWN_NODE_TYPE)
      ) {
        return [new Set([UNKNOWN_NODE_TYPE])];
      }

      for (let i = 0; i < operator.length; i++) {
        const returnTypeVariant = operator[i].returnType;
        const neededTypeVariant = operator[i].operandType;

        if (neededTypeVariant === null) {
          return [new Set([returnTypeVariant]), i];
        }

        if (
          leftNodeType.has(neededTypeVariant) &&
          rightNodeType.has(neededTypeVariant) &&
          leftNodeType.size === 1 &&
          rightNodeType.size === 1
        ) {
          return [new Set([returnTypeVariant]), i];
        }
      }

      return [new Set([UNKNOWN_NODE_TYPE])];
    }

    if (node instanceof IfStatementNode) {
      const consequent = this.getNodeReturnType(node.consequent);
      const alternate = this.getNodeReturnType(node.alternate);
      alternate[0].forEach((i) => consequent[0].add(i));

      return consequent;
    }
    if (node instanceof FunctionNode) {
      const currentFunction = allFunctions[node.name as ValidFunctionsNames];

      if (!currentFunction) {
        return [new Set([UNKNOWN_NODE_TYPE])];
      }

      // empty args array means func does not accept any arguments
      if (node.args.length === 0 && currentFunction[0].args.length === 0) {
        return [new Set(currentFunction[0].returnType), 0];
      }

      // get all types for node args
      const nodeArgs: [Set<string>, number?][] = [];
      for (const arg of node.args) {
        const argType = this.getNodeReturnType(arg);

        if (!argType[0].has(UNKNOWN_NODE_TYPE)) {
          nodeArgs.push(argType);
        } else {
          return [new Set([UNKNOWN_NODE_TYPE])];
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
              argVariantsCoincidence !== 0 &&
              argVariantsCoincidence === nodeArgType.size
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
                argVariantsCoincidence !== 0 &&
                argVariantsCoincidence === nodeArgType.size
              ) {
                coincidences++;
              }
            }
          }
        }
        if (coincidences === nodeArgs.length) {
          return [new Set(functionVariantReturnType), i];
        }
      }
    }
    return [new Set([UNKNOWN_NODE_TYPE])];
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
      // replace brackets around format stringify
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
          return `VARIABLES[${this.globalVars[node.variable.text].value}]`;
        } else {
          return `{${this.globalVars[node.variable.text].value}}`;
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
      const operator =
        allUnarOperators[node.operator.token.name as ValidUnarOperatorsNames];
      const operand = this.stringifyAst(node.operand, format);

      if (operator.types.length === 0) {
        return operator[`${format}Fn`](operand);
      }

      let isOperandValid = false;
      const [operatorType] = this.getNodeReturnType(node);
      operatorType.forEach((i) => {
        if (operator.types.find((j) => j === i)) {
          isOperandValid = true;
        }
      });

      if (isOperandValid) {
        return operator[`${format}Fn`](operand);
      }

      throw new Error(
        `Неожиданный тип данных при ${node.operator.text} на позиции ${node.operand.start}`,
      );
    }
    if (node instanceof BinOperationNode) {
      const operator =
        allBinOperators[node.operator.token.name as ValidBinOperatorsNames];
      const [operatorType, index] = this.getNodeReturnType(node);

      const leftNode = this.stringifyAst(node.left, format);
      const rightNode = this.stringifyAst(node.right, format);

      // Maybe change logic for show correct error position
      if (operatorType.has(UNKNOWN_NODE_TYPE)) {
        throw new Error(
          `Неожиданный тип данных при ${node.operator.text} на позиции ${node.operator.pos}`,
        );
      }

      if (index !== undefined) {
        return operator[index][`${format}Fn`](leftNode, rightNode);
      }

      throw new Error(
        `Неожиданный тип данных при ${node.operator.text} на позиции ${node.operator.pos}`,
      );
    }
    if (node instanceof IfStatementNode) {
      const test = this.stringifyAst(node.test, format);
      const consequent = this.stringifyAst(node.consequent, format);
      const alternate = this.stringifyAst(node.alternate, format);

      return ifStatementMap[`${format}Fn`](test, consequent, alternate);
    }
    if (node instanceof FunctionNode) {
      // may use as, because next stroke check valid func
      const currentFunction = allFunctions[node.name as ValidFunctionsNames];
      if (currentFunction) {
        const [nodeReturnType, idx] = this.getNodeReturnType(node);

        if (nodeReturnType.has(UNKNOWN_NODE_TYPE)) {
          throw new Error(
            `Неожиданный тип данных в функции ${node.name} на позиции ${node.func.pos}`,
          );
        }

        if (idx === undefined) {
          throw new Error('');
        }

        const functionArgs = node.args.map((arg) => {
          const argNode = this.stringifyAst(arg, format);
          return argNode;
        });

        const res = currentFunction[idx][`${format}Fn`](functionArgs);
        console.log(res);

        return res;
      }
      throw new Error(
        `Недопустимое имя функции ${node.name} на позиции ${node.func.pos}`,
      );
    }
    throw new Error(`Недопустимый синтаксис на позиции ${node.start}`);
  }
}
