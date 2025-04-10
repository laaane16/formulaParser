import { VARIABLE_NODE_TYPE } from '../constants/nodeTypes';
import Token from '../Lexer/Token';
import ExpressionNode from './ExpressionNode';

export default class VariableNode extends ExpressionNode {
  variable: Token;

  constructor(variable: Token) {
    super(
      VARIABLE_NODE_TYPE,
      variable.pos,
      variable.pos + variable.text.length,
    );
    this.variable = variable;
  }
}
