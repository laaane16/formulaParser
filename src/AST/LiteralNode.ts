import { LITERAL_NODE_TYPE } from '../constants/nodeTypes';
import Token from '../Lexer/Token';
import ExpressionNode from './ExpressionNode';

export default class LiteralNode extends ExpressionNode {
  literal: Token;

  constructor(literal: Token) {
    super(LITERAL_NODE_TYPE, literal.pos, literal.pos + literal.text.length);
    this.literal = literal;
  }
}
