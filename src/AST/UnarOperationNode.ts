import { UNAR_OPERATION_NODE_TYPE } from '../constants/nodeTypes';
import Token from '../Lexer/Token';
import ExpressionNode from './ExpressionNode';

export default class UnarOperationNode extends ExpressionNode {
  operator: Token;
  operand: ExpressionNode;

  constructor(operator: Token, operand: ExpressionNode) {
    super(UNAR_OPERATION_NODE_TYPE, operator.pos, operator.pos + operand.end);
    this.operator = operator;
    this.operand = operand;
  }
}
