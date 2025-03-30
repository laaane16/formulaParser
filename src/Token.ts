import TokenType from './TokenType';

export default class Token {
  token: TokenType;
  text: string;
  pos: number;

  constructor(token: TokenType, text: string, pos: number) {
    this.token = token;
    this.text = text;
    this.pos = pos;
  }
}
