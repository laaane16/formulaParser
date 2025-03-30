import { VARIABLE_NODE_TYPE } from '../constants';
import Token from '../Token';
import ExpressionNode from './ExpressionNode';

export default class VariableNode extends ExpressionNode {
  variable: Token;

  constructor(variable: Token) {
    super(VARIABLE_NODE_TYPE);
    this.variable = variable;
  }
}
