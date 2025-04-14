import Token from './Token';
import { tokenTypesList } from './TokenType';

export default class Lexer {
  code: string;
  pos: number = 0;
  tokens: Token[] = [];

  constructor(code: string) {
    this.code = code;
  }

  lexAnalysis(): Token[] {
    while (this.nextToken()) {
      /* empty */
    }
    this.tokens = this.tokens.filter(
      (i) => i.token.name !== tokenTypesList.get('SPACE')?.name,
    );
    return this.tokens;
  }

  nextToken(): boolean {
    if (this.pos >= this.code.length) {
      return false;
    }

    const tokenTypesValues = Array.from(tokenTypesList);
    for (const tokenType of tokenTypesValues) {
      const regex = new RegExp('^' + tokenType[1].regex);
      const result = this.code.substring(this.pos).match(regex);

      if (result && result[0]) {
        this.tokens.push(new Token(tokenType[1], result[0], this.pos));
        this.pos += result[0].length;
        return true;
      }
    }

    throw new Error(`На позиции ${this.pos} обнаружена ошибка`);
  }
}
