import { ARRAY_NODE_TYPE } from '../constants/nodeTypes';
import Token from '../Lexer/Token';
import ExpressionNode from './ExpressionNode';

export default class NumberNode extends ExpressionNode {
  elements: ExpressionNode[] = [];

  constructor(leftPar: Token, elements: ExpressionNode[]) {
    const { pos } = leftPar;

    const startFuncExpression = pos;
    const endFuncExpression =
      // if array hasn`t elements we should sum start pos and two brackets, else last elements length includes this length and one bracket
      elements[elements.length - 1]?.end + 2 || leftPar.pos + 1;

    super(ARRAY_NODE_TYPE, startFuncExpression, endFuncExpression);

    this.elements = elements;
  }
}
