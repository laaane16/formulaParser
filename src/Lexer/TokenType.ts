export default class TokenType {
  regex: string;
  name: string;

  constructor(name: string, regex: string) {
    this.name = name;
    this.regex = regex;
  }
}

// Some regexp are intersection and that's why we should using data type with while maintaining the sequence of adding elements
export const tokenTypesList: Map<string, TokenType> = new Map([
  // DATA TYPES
  ['NUMBER', new TokenType('NUMBER', '[0-9]+\\.*[0-9]*')],
  ['STRING', new TokenType('STRING', '"((?:\\\\.|[^"\\\\])*)"')],
  // VARIABLES: {{...}}
  ['VARIABLE', new TokenType('VARIABLE', '{{((?:\\\\.|[^{\\\\])+)}}')],

  // IF
  ['IF', new TokenType('IF', 'IF')],

  // FUNCTIONS: ASD()
  ['FUNCTION', new TokenType('FUNCTION', '[A-Z]+')],

  // SYMBOLS
  ['SPACE', new TokenType('SPACE', '[ \\n\\t\\r]')],
  ['LPAR', new TokenType('LPAR', '\\(')],
  ['RPAR', new TokenType('RPAR', '\\)')],
  ['VIRGULE', new TokenType('VIRGULE', ',')],

  // UNAR_OPERATORS
  ['NOT', new TokenType('NOT', '(?!\\!=)!')], // NOT psql

  // KEYWORDS
  ['TRUE', new TokenType('TRUE', 'true')], // TRUE psql
  ['FALSE', new TokenType('FALSE', 'false')], // TRUE psql

  //BIN_OPERATORS
  ['PLUS', new TokenType('PLUS', '\\+')], // + PSQL
  ['MINUS', new TokenType('MINUS', '-')], // - PSQL
  ['MULTIPLY', new TokenType('MULTIPLY', '\\*')], // * PSQL
  ['DIVISION', new TokenType('DIVISION', '/')], // / PSQL
  ['REMAINDER', new TokenType('REMAINDER', '%')], // % PSQL
  ['POWER', new TokenType('POWER', '\\^')], // ^ PSQL

  ['EQUAL', new TokenType('EQUAL', '==')], // = PSQL
  ['NOT_EQUAL', new TokenType('NOT_EQUAL', '\\!=')], // != PSQL
  ['GREATER', new TokenType('GREATER', '(?!>=)>')], // > PSQL
  ['GREATER_OR_EQUAL', new TokenType('GREATER_OR_EQUAL', '>=')], // >= PSQL
  ['LESS', new TokenType('LESS', '(?!<=)<')], // < PSQL
  ['LESS_OR_EQUAL', new TokenType('LESS_OR_EQUAL', '<=')], // <= PSQL
  // ['AND', new TokenType('AND', '&&')], // AND PSQL
  // ['OR', new TokenType('OR', '\\|\\|')], // OR PSQL
]);

// Map.get return TokenType | undefined, but we know that this keys includes in map
export const tokenTypesBinOperations: TokenType[] = [
  tokenTypesList.get('PLUS') as TokenType,
  tokenTypesList.get('MINUS') as TokenType,
  tokenTypesList.get('DIVISION') as TokenType,
  tokenTypesList.get('MULTIPLY') as TokenType,
  tokenTypesList.get('REMAINDER') as TokenType,
  tokenTypesList.get('POWER') as TokenType,
  tokenTypesList.get('EQUAL') as TokenType,
  tokenTypesList.get('NOT_EQUAL') as TokenType,
  tokenTypesList.get('GREATER') as TokenType,
  tokenTypesList.get('GREATER_OR_EQUAL') as TokenType,
  tokenTypesList.get('LESS') as TokenType,
  tokenTypesList.get('LESS_OR_EQUAL') as TokenType,
  // tokenTypesList.get('AND') as TokenType,
  // tokenTypesList.get('OR') as TokenType,
];

export const tokenTypesUnarOperations = [
  tokenTypesList.get('NOT') as TokenType,
  tokenTypesList.get('MINUS') as TokenType,
];

export const tokenTypesKeywords = [
  tokenTypesList.get('TRUE') as TokenType,
  tokenTypesList.get('FALSE') as TokenType,
];
