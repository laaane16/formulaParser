import { PARENTHESIZED_NODE_TYPE } from '../constants/nodeTypes';
import ExpressionNode from './ExpressionNode';

export default class ParenthesizedNode extends ExpressionNode {
  expression: ExpressionNode;

  constructor(expression: ExpressionNode) {
    super(
      PARENTHESIZED_NODE_TYPE,
      // subtract the first bracket
      expression.start - 1,
      // add the second bracket
      expression.start + expression.end + 1,
    );
    this.expression = expression;
  }
}
