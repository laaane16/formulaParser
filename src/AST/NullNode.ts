import { NULL_NODE_TYPE } from '../constants/nodeTypes';
import Token from '../Lexer/Token';
import ExpressionNode from './ExpressionNode';

export default class NullNode extends ExpressionNode {
  keyword: Token;

  constructor(keyword: Token) {
    super(NULL_NODE_TYPE, keyword.pos, keyword.pos + keyword.text.length);
    this.keyword = keyword;
  }
}
