import Lexer from './Lexer';
import ParserCore from './Parser';
import { FormulaError } from './lib/exceptions';
import { isNil } from './lib/isNil';

const PREFIX = '{{';
const POSTFIX = '}}';

interface IField {
  id: string;
  title: string;
  type: string;
}

/**
 * The `Parser` class is responsible for converting a JavaScript-like expression into an SQL query.
 */
export default class Parser {
  public expression: string;
  private lexer: Lexer;
  private fields: IField[];

  /**
   * Creates a new `Parser` instance.
   * @param {string} expression - The input formula or expression.
   * @param {IField[]} [fields=[]] - An optional array of field metadata.
   */
  constructor(expression: string, fields: IField[] = []) {
    if (isNil(expression)) FormulaError.requiredParamsError(['expression']);
    this.expression = expression;
    this.lexer = new Lexer(expression);
    if (fields.length === 0) FormulaError.requiredParamsError(['fields']);
    this.fields = fields;
  }

  /**
   * Prepares the field mappings for use in the parsing process.
   * @returns {Array<{ title: string, value: string, type: string }>} The mapped field objects.
   */
  private prepareFields() {
    return this.fields.map((field) => ({
      title: `${PREFIX}${field.title}${POSTFIX}`,
      value: field.id,
      type: field.type,
    }));
  }

  /**
   * Converts the input expression into an SQL query.
   * @returns {string} The generated SQL query.
   */
  toSql(): string {
    this.lexer.lexAnalysis();
    const parser = new ParserCore(this.lexer.tokens);

    parser.initVars(this.prepareFields());
    const node = parser.parseCode();

    return parser.toSql(node)[0]; // Currently, returns only the first SQL line
  }
}

// Example usage:

const fields = [
  { id: '1', title: 'Поле 1', type: 'number' },
  { id: '2', title: 'Поле 2', type: 'number' },
  { id: '3', title: 'Поле 3', type: 'text' },
];

const expression = '{{Поле 3}} + 1';

const parser = new Parser(expression, fields);
const sqlQuery = parser.toSql();

console.log(sqlQuery); // Outputs the generated SQL query
