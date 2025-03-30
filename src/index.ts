import { LITERAL_NODE_TYPE, NUMBER_NODE_TYPE } from './constants';
import Lexer from './Lexer';
import Parser from './Parser';

interface IField {
  fieldId: string;
  title: string;
  type: string;
}

const fields: IField[] = [
  { fieldId: '1', title: 'Поле 1', type: NUMBER_NODE_TYPE },
  { fieldId: '2', title: 'Поле 2', type: NUMBER_NODE_TYPE },
  { fieldId: '3', title: 'Поле 3', type: LITERAL_NODE_TYPE },
];

const prepareFields = fields.map((field) => ({
  title: `{{${field.title}}}`,
  value: field.fieldId,
  type: field.type,
}));

const code = `({{Поле 1}} -1 || 1 + (({{Поле 2}}))) * (4 + 1) + SUM(1,2,3,{{Поле 2}}, SUM(1,2,SUM(1,{{Поле 2}})))`;

const lexer = new Lexer(code);

lexer.lexAnalysis();

const parser = new Parser(lexer.tokens);
parser.initVars(prepareFields);

const node = parser.parseCode();

// Пока возвращаем только одну строку
console.log(parser.apiFormat(node)[0]);
