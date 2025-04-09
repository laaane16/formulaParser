import { STATEMENTS_NODE_TYPE } from '../constants/nodeTypes';
import ExpressionNode from './ExpressionNode';

export default class StatementsNode extends ExpressionNode {
  codeStrings: ExpressionNode[] = [];

  constructor() {
    // TODO: throw the correct position
    super(STATEMENTS_NODE_TYPE, 0, 0);
  }

  addNode(node: ExpressionNode): void {
    this.codeStrings.push(node);
  }
}
