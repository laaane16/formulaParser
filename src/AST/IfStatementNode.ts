import { IF_STATEMENT_NODE_TYPE } from '../constants/nodeTypes';
import Token from '../Lexer/Token';
import ExpressionNode from './ExpressionNode';

export default class IfStatementNode extends ExpressionNode {
  ifToken: Token;
  test: ExpressionNode;
  consequent: ExpressionNode;
  alternate: ExpressionNode;

  constructor(
    token: Token,
    test: ExpressionNode,
    consequent: ExpressionNode,
    alternate: ExpressionNode,
  ) {
    // add a bracket to the end
    super(IF_STATEMENT_NODE_TYPE, token.pos, alternate.end + 1);
    this.ifToken = token;
    this.test = test;
    this.consequent = consequent;
    this.alternate = alternate;
  }
}
