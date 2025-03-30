import { LITERAL_NODE_TYPE } from '../constants';
import Token from '../Token';
import ExpressionNode from './ExpressionNode';

export default class LiteralNode extends ExpressionNode {
  literal: Token;

  constructor(literal: Token) {
    super(LITERAL_NODE_TYPE);
    this.literal = literal;
  }
}
