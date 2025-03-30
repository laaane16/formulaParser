import { PARENTHESIZED_NODE_TYPE } from '../constants';
import ExpressionNode from './ExpressionNode';

export default class ParenthesizedNode extends ExpressionNode {
  expression: ExpressionNode;

  constructor(expression: ExpressionNode) {
    super(PARENTHESIZED_NODE_TYPE);
    this.expression = expression;
  }
}
