import { STATEMENTS_NODE_TYPE } from '../constants';
import ExpressionNode from './ExpressionNode';

export default class StatementsNode extends ExpressionNode {
  codeStrings: ExpressionNode[] = [];

  constructor() {
    super(STATEMENTS_NODE_TYPE);
  }

  addNode(node: ExpressionNode): void {
    this.codeStrings.push(node);
  }
}
