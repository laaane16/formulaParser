import { STATEMENTS_NODE_TYPE } from '../constants/nodeTypes';
import ExpressionNode from './ExpressionNode';

export default class StatementsNode extends ExpressionNode {
  codeStrings: ExpressionNode[] = [];

  constructor(end: number) {
    super(STATEMENTS_NODE_TYPE, 0, end);
  }

  addNode(node: ExpressionNode): void {
    this.codeStrings.push(node);
  }
}
