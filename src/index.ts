import Lexer from './Lexer';
import Parser from './Parser';

const PREFIX = '{{';
const POSTFIX = '}}';

interface IField {
  fieldId: string;
  title: string;
  type: string;
}

const fields: IField[] = [
  { fieldId: '1', title: 'Поле 1', type: 'number' },
  { fieldId: '2', title: 'Поле 2', type: 'number' },
  { fieldId: '3', title: 'Поле 3', type: 'text' },
];

const prepareFields = fields.map((field) => ({
  title: `${PREFIX}${field.title}${POSTFIX}`,
  value: field.fieldId,
  type: field.type,
}));

const code = `CONCAT("a") + 1`;

const lexer = new Lexer(code);

lexer.lexAnalysis();

const parser = new Parser(lexer.tokens);
parser.initVars(prepareFields);

const node = parser.parseCode();

// Пока возвращаем только одну строку
console.log(parser.toSql(node)[0]);
