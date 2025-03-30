import { FUNCTION_NODE_TYPE } from '../constants';
import ExpressionNode from './ExpressionNode';

export default class FunctionNode extends ExpressionNode {
  name: string;
  args: ExpressionNode[] = [];

  constructor(name: string, args: ExpressionNode[]) {
    super(FUNCTION_NODE_TYPE);
    this.name = name;
    this.args = args;
  }
}
