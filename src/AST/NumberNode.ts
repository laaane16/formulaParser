import { NUMBER_NODE_TYPE } from '../constants';
import Token from '../Token';
import ExpressionNode from './ExpressionNode';

export default class NumberNode extends ExpressionNode {
  number: Token;

  constructor(number: Token) {
    super(NUMBER_NODE_TYPE);
    this.number = number;
  }
}
