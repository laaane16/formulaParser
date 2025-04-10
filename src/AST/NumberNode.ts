import { NUMBER_NODE_TYPE } from '../constants/nodeTypes';
import Token from '../Lexer/Token';
import ExpressionNode from './ExpressionNode';

export default class NumberNode extends ExpressionNode {
  number: Token;

  constructor(number: Token) {
    super(NUMBER_NODE_TYPE, number.pos, number.pos + number.text.length);
    this.number = number;
  }
}
