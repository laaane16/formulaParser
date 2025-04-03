import { LITERAL_NODE_TYPE, NodeTypesValues } from './constants/nodeTypes';

interface IArg {
  // name: string, не думаю что нужен
  // default: boolean, пока под вопросом
  type: NodeTypesValues;

  // только для крайних параметров
  required?: boolean;
  many?: boolean;
}
interface IFunction {
  args: IArg[];
  returnType: NodeTypesValues; // возможно функция
  jsFn: () => string;
  sqlFn: () => string;
}

type VariableFunction = IFunction[];

export const validFunctions: Record<string, VariableFunction> = {
  CONCAT: [
    {
      args: [
        {
          type: LITERAL_NODE_TYPE,
          many: true,
        },
      ],
      returnType: LITERAL_NODE_TYPE,
      jsFn: () => '',
      sqlFn: () => '',
    },
  ],
  // LENGTH: {
  //   types: [LITERAL_NODE_TYPE],
  //   return: [NUMBER_NODE_TYPE],
  // },
  // REPLACE: {
  //   types: [LITERAL_NODE_TYPE, LITERAL_NODE_TYPE],
  //   return: [LITERAL_NODE_TYPE],
  // },
  // LOWERCASE: {
  //   types: [LITERAL_NODE_TYPE],
  //   return: [LITERAL_NODE_TYPE],
  // },
  // UPPERCASE: {
  //   types: [LITERAL_NODE_TYPE],
  //   return: [LITERAL_NODE_TYPE],
  // },
  // INDEXOF: {
  //   types: [LITERAL_NODE_TYPE, LITERAL_NODE_TYPE],
  //   return: [NUMBER_NODE_TYPE],
  // },
  // SUM: {
  //   types: [NUMBER_NODE_TYPE],
  //   return: [NUMBER_NODE_TYPE],
  // },
  // AVG: {
  //   types: [NUMBER_NODE_TYPE],
  //   return: [NUMBER_NODE_TYPE],
  // },
  // ROUND: {
  //   types: [NUMBER_NODE_TYPE, NUMBER_NODE_TYPE],
  //   return: [NUMBER_NODE_TYPE],
  // },
  // ABS: {
  //   types: [NUMBER_NODE_TYPE],
  //   return: [NUMBER_NODE_TYPE],
  // },
  // CEIL: {
  //   types: [NUMBER_NODE_TYPE],
  //   return: [NUMBER_NODE_TYPE],
  // },
  // FLOOR: {
  //   types: [NUMBER_NODE_TYPE],
  //   return: [NUMBER_NODE_TYPE],
  // },
  // POW: {
  //   types: [NUMBER_NODE_TYPE, NUMBER_NODE_TYPE],
  //   return: [NUMBER_NODE_TYPE],
  // },
  // SQRT: {
  //   types: [NUMBER_NODE_TYPE],
  //   return: [NUMBER_NODE_TYPE],
  // },
  // RANDOM: {
  //   types: [],
  //   return: [NUMBER_NODE_TYPE],
  // },
  // не знаю, что должны возвращать, принимать
  // CATALOGID:{
  //   types:[],
  //   return: [VARIABLE_NODE_TYPE]
  // },
  // RECORDID:{
  //   types:[],
  //   return: [VARIABLE_NODE_TYPE]
  // }
};

export const sqlFunctionsMap: Record<string, string> = {
  CONCAT: 'CONCAT', // неогр. кол-во аргументов
  LENGTH: 'LENGTH', // 1 аргумент
  REPLACE: 'REPLACE', // 3 аргумента: str, from, to
  LOWERCASE: 'LOWER', // 1 аргумент
  UPPERCASE: 'UPPER', // 1 аргумент
  INDEXOF: 'POSITION', // 2 аргумента между ними in
  SUM: 'SUM',
  AVG: 'AVG',
  ROUND: 'ROUND', // +, 1|2 аргумент(a)
  ABS: 'ABS', // +, 1 аргумент
  CEIL: 'CEIL', // +, 1 аргумент
  FLOOR: 'FLOOR', // +, 1 аргумент
  POW: 'POWER', // +, 2 аргумента
  SQRT: 'SQRT', // +, 1 аргумент
  RANDOM: 'RANDOM', //+, нет аргументов
};
