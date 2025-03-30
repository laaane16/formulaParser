export default class TokenType {
  regex: string;
  name: string;
  value?: string;

  constructor(name: string, regex: string, value?: string) {
    this.regex = regex;
    this.name = name;
    this.value = value;
  }
}

export const tokenTypesList = {
  // DATA TYPES
  NUMBER: new TokenType('NUMBER', '[0-9]+'),
  STRING: new TokenType('STRING', '"((?:\\\\.|[^"\\\\])*)"'),
  // VARIABLES: {{...}}
  VARIABLE: new TokenType('VARIABLE', '{{((?:\\\\.|[^{\\\\])+)}}'),

  // FUNCTIONS: ASD()
  FUNCTION: new TokenType('FUNCTION', '[A-Z]+'),

  // SYMBOLS
  SPACE: new TokenType('SPACE', '[ \\n\\t\\r]'),
  LPAR: new TokenType('LPAR', '\\('),
  RPAR: new TokenType('RPAR', '\\)'),
  VIRGULE: new TokenType('VIRGULE', ','),

  // TODO: ПОДКЛЮЧИТЬ
  // UNAR_OPERATORS
  NOT: new TokenType('NOT', '!', 'NOT'), // NOT psql

  // TODO: ПОДКЛЮЧИТЬ
  // KEYWORDS
  TRUE: new TokenType('KEYWORD', 'true', 'TRUE'),
  FALSE: new TokenType('KEYWORD', 'true', 'TRUE'),

  //BIN_OPERATORS
  PLUS: new TokenType('PLUS', '\\+', '+'), // + PSQL
  MINUS: new TokenType('MINUS', '-', '-'), // - PSQL
  MULTIPLY: new TokenType('MULTIPLY', '\\*', '*'), // * PSQL
  DIVISION: new TokenType('DIVISION', '/', '/'), // / PSQL
  REMAINDER: new TokenType('REMAINDER', '%', '%'), // % PSQL
  POWER: new TokenType('POWER', '^', '^'), // ^ PSQL

  EQUAL: new TokenType('EQUAL', '==', '='), // = PSQL
  NOT_EQUAL: new TokenType('NOT_EQUAL', '!=', '!='), // != PSQL
  GREATER: new TokenType('GREATER', '>', '>'), // > PSQL
  GREATER_OR_EQUAL: new TokenType('GREATER_OR_EQUAL', '>=', '>='), // >= PSQL
  LESS: new TokenType('LESS', '<', '<'), // < PSQL
  LESS_OR_EQUAL: new TokenType('LESS_OR_EQUAL', '<=', '<='), // <= PSQL
  AND: new TokenType('AND', '&&', 'AND'), // AND PSQL
  OR: new TokenType('OR', '\\|\\|', 'OR'), // OR PSQL
};

export const tokenTypesBinOperations = [
  tokenTypesList.PLUS,
  tokenTypesList.MINUS,
  tokenTypesList.DIVISION,
  tokenTypesList.MULTIPLY,
  tokenTypesList.REMAINDER,
  tokenTypesList.POWER,
  tokenTypesList.EQUAL,
  tokenTypesList.NOT_EQUAL,
  tokenTypesList.GREATER,
  tokenTypesList.GREATER_OR_EQUAL,
  tokenTypesList.LESS,
  tokenTypesList.LESS_OR_EQUAL,
  tokenTypesList.AND,
  tokenTypesList.OR,
];
