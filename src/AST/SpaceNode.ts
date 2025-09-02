import { SPACE_NODE_TYPE } from '../constants/nodeTypes';
import Token from '../Lexer/Token';
import ExpressionNode from './ExpressionNode';

export default class SpaceNode extends ExpressionNode {
  space: Token;

  constructor(space: Token) {
    super(SPACE_NODE_TYPE, space.pos, space.pos + space.text.length);
    this.space = space;
  }
}
