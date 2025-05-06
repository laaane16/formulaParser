import { BOOLEAN_NODE_TYPE } from '../constants/nodeTypes';
import Token from '../Lexer/Token';
import ExpressionNode from './ExpressionNode';

export default class BooleanNode extends ExpressionNode {
  keyword: Token;

  constructor(keyword: Token) {
    super(BOOLEAN_NODE_TYPE, keyword.pos, keyword.pos + keyword.text.length);
    this.keyword = keyword;
  }
}
