import BinOperationNode from './AST/BinOperationNode';
import ExpressionNode from './AST/ExpressionNode';
import FunctionNode from './AST/FunctionNode';
import LiteralNode from './AST/LiteralNode';
import NumberNode from './AST/NumberNode';
import ParenthesizedNode from './AST/ParenthesizedNode';
import StatementsNode from './AST/StatementsNode';
import VariableNode from './AST/VariableNode';
import { sqlFunctionsMap, validFunctions } from './validFunctions';
import Token from './Token';
import TokenType, {
  tokenTypesBinOperations,
  tokenTypesList,
} from './TokenType';

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
    variables.forEach(
      (i) => (this.globalVars[i.title] = { value: i.value, type: i.type }),
    );
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
  // '({{Поле1}} + {{Поле2}})'
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

  getCurrentNode(): ExpressionNode {
    const string = this.match(tokenTypesList.STRING);
    if (string) {
      return new LiteralNode(string);
    }

    const number = this.match(tokenTypesList.NUMBER);
    if (number) {
      return new NumberNode(number);
    }

    const variable = this.match(tokenTypesList.VARIABLE);
    if (variable) {
      return new VariableNode(variable);
    }

    const leftPar = this.match(tokenTypesList.LPAR);
    if (leftPar) {
      const node = this.parseFormula();
      this.require(tokenTypesList.RPAR);
      return new ParenthesizedNode(node);
    }

    const func = this.match(tokenTypesList.FUNCTION);
    if (func) {
      const leftPar = this.match(tokenTypesList.LPAR);
      if (leftPar) {
        const args = this.parseFunctionArgs();
        this.require(tokenTypesList.RPAR);
        return new FunctionNode(func.text, args);
      }
      throw new Error(
        `Ожидалось перечисление аргументов на позиции ${this.pos}`,
      );
    }

    throw new Error(`Неожиданный синтаксис на ${this.pos}`);
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

  parseExpression(): ExpressionNode {
    // 1 || "" || FN()
    //`{{Поле 1}} + {{Поле 2}} - SUM({{Поле 3}}, {{Field_4}}) + 1`;
    const currentNode = this.getCurrentNode();

    const operator = this.match(...tokenTypesBinOperations);
    if (!operator) {
      return currentNode;
    }

    const rightNode = this.parseFormula();
    const binaryNode = new BinOperationNode(operator, currentNode, rightNode);

    return binaryNode;
  }

  parseCode(): StatementsNode {
    const root = new StatementsNode();
    while (this.pos < this.tokens.length) {
      const codeStringNode = this.parseExpression();
      // Если вдруг формуле понадобится быть многострочной
      // this.require(СИМВОЛ_ОКОНЧАНИЯ_СТРОКИ)
      root.addNode(codeStringNode);
    }
    return root;
  }

  run() {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiFormat(node: ExpressionNode): any {
    if (node instanceof NumberNode) {
      return parseInt(node.number.text);
    }
    if (node instanceof LiteralNode) {
      return node.literal.text;
    }
    if (node instanceof ParenthesizedNode) {
      return `(${this.apiFormat(node.expression)})`;
    }
    if (node instanceof BinOperationNode) {
      return `${this.apiFormat(node.left)} ${node.operator.token.value} ${this.apiFormat(node.right)}`;
    }
    if (node instanceof VariableNode) {
      if (this.globalVars[node.variable.text]) {
        return `$${this.globalVars[node.variable.text].value}`;
      }
      throw new Error(`Недопустимая переменная на позиции ${this.pos}`);
    }
    if (node instanceof StatementsNode) {
      return node.codeStrings.map((i) => this.apiFormat(i));
    }

    if (node instanceof FunctionNode) {
      const currentFunction = validFunctions[node.name];
      if (currentFunction) {
        return `${sqlFunctionsMap[node.name]}(${node.args.map((arg, index) => {
          const nodeType = arg.type;
          const curArg = this.apiFormat(arg);

          if (currentFunction.types.length === 0) {
            // или вернуть пустую функцию, хз
            throw new Error(
              `Функция ${node.name} не принимает никаких параметров`,
            );
          }

          const currentArgType = currentFunction.types[index];
          const lastArgType =
            currentFunction.types[currentFunction.types.length - 1];

          if (currentArgType === nodeType || lastArgType === nodeType) {
            return curArg;
          }

          if (arg instanceof VariableNode) {
            const variableType = this.globalVars[arg.variable.text].type;
            if (
              currentArgType === variableType ||
              lastArgType === variableType
            ) {
              return curArg;
            }
          }

          if (arg instanceof FunctionNode) {
            const functionInArg = validFunctions[arg.name];
            const returnType = functionInArg.return[0];
            if (currentArgType === returnType || lastArgType === returnType) {
              return curArg;
            }
          }

          throw new Error(
            `Ожидается тип данных ${currentFunction.types} на позиции ${this.pos}`,
          );
        })})`;
      }
      throw new Error(`Недопустимое имя функции на позиции ${this.pos}`);
    }

    throw new Error(`Недопустимый синтаксис на позиции ${this.pos}`);
  }

  // toSql() {

  // }
}
