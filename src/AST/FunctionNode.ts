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
      pos +
      // function name length
      text.length +
      // last argument end position
      (args[args.length - 1]?.end || 0) +
      // two brackets
      2;
    super(FUNCTION_NODE_TYPE, startFuncExpression, endFuncExpression);
    this.func = func;
    this.name = name;
    this.args = args;
  }
}
