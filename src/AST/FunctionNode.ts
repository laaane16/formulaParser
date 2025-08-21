import { FUNCTION_NODE_TYPE } from '../constants/nodeTypes';
import Token from '../Lexer/Token';
import ExpressionNode from './ExpressionNode';

export default class FunctionNode extends ExpressionNode {
  name: string;
  func: Token;
  args: ExpressionNode[] = [];

  constructor(func: Token, name: string, args: ExpressionNode[]) {
    const { pos, text } = func;
    const startFuncExpression = pos;

    const endFuncExpression =
      // if func hasn`t args we should sum start pos, func name length and two brackets, else last args length includes this length and one bracket
      args[args.length - 1]?.end + 2 || pos + text.length + 1;
    super(FUNCTION_NODE_TYPE, startFuncExpression, endFuncExpression);
    this.func = func;
    this.name = name;
    this.args = args;
  }
}
