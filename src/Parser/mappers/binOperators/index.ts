import {
  BOOLEAN_NODE_TYPE,
  LITERAL_NODE_TYPE,
  NUMBER_NODE_TYPE,
} from '../../../constants/nodeTypes';
import { ValidBinOperatorsNames, IOperator } from './types';

// TODO: write tests
// null in returnType means all types are valid
export const allBinOperators: Record<ValidBinOperatorsNames, IOperator[]> = {
  PLUS: [
    {
      operandType: NUMBER_NODE_TYPE,
      returnType: NUMBER_NODE_TYPE,
      jsFn: (left, right) => `${left} + ${right}`,
      sqlFn: (left, right) => `${left} + ${right}`,
    },
    {
      operandType: LITERAL_NODE_TYPE,
      returnType: LITERAL_NODE_TYPE,
      jsFn: (left, right) => `${left} + ${right}`,
      sqlFn: (left, right) => `CONCAT(${left}, ${right})`,
    },
  ],
  MINUS: [
    {
      operandType: NUMBER_NODE_TYPE,
      returnType: NUMBER_NODE_TYPE,
      jsFn: (left, right) => `${left} - ${right}`,
      sqlFn: (left, right) => `${left} - ${right}`,
    },
  ],
  MULTIPLY: [
    {
      operandType: NUMBER_NODE_TYPE,
      returnType: NUMBER_NODE_TYPE,
      jsFn: (left, right) => `${left} * ${right}`,
      sqlFn: (left, right) => `${left} * ${right}`,
    },
  ],
  DIVISION: [
    {
      operandType: NUMBER_NODE_TYPE,
      returnType: NUMBER_NODE_TYPE,
      jsFn: (left, right) => `${left} / ${right}`,
      sqlFn: (left, right) => `${left} / ${right}`,
    },
  ],
  REMAINDER: [
    {
      operandType: NUMBER_NODE_TYPE,
      returnType: NUMBER_NODE_TYPE,
      jsFn: (left, right) => `${left} % ${right}`,
      sqlFn: (left, right) => `${left} % ${right}`,
    },
  ],
  POWER: [
    {
      operandType: NUMBER_NODE_TYPE,
      returnType: NUMBER_NODE_TYPE,
      jsFn: (left, right) => `${left} ^ ${right}`,
      sqlFn: (left, right) => `${left} ^ ${right}`,
    },
  ],
  EQUAL: [
    {
      operandType: null,
      returnType: BOOLEAN_NODE_TYPE,
      jsFn: (left, right) => `${left} == ${right}`,
      sqlFn: (left, right) => `${left} = ${right}`,
    },
  ],
  NOT_EQUAL: [
    {
      operandType: null,
      returnType: BOOLEAN_NODE_TYPE,
      jsFn: (left, right) => `${left} != ${right}`,
      sqlFn: (left, right) => `${left} != ${right}`,
    },
  ],
  GREATER: [
    {
      operandType: null,
      returnType: BOOLEAN_NODE_TYPE,
      jsFn: (left, right) => `${left} > ${right}`,
      sqlFn: (left, right) => `${left} > ${right}`,
    },
  ],
  GREATER_OR_EQUAL: [
    {
      operandType: null,
      returnType: BOOLEAN_NODE_TYPE,
      jsFn: (left, right) => `${left} >= ${right}`,
      sqlFn: (left, right) => `${left} >= ${right}`,
    },
  ],
  LESS: [
    {
      operandType: null,
      returnType: BOOLEAN_NODE_TYPE,
      jsFn: (left, right) => `${left} < ${right}`,
      sqlFn: (left, right) => `${left} < ${right}`,
    },
  ],
  LESS_OR_EQUAL: [
    {
      operandType: null,
      returnType: BOOLEAN_NODE_TYPE,
      jsFn: (left, right) => `${left} <= ${right}`,
      sqlFn: (left, right) => `${left} <= ${right}`,
    },
  ],

  // i dont`t know how work with this
  // AND: [
  //   {
  //     operandType: []e,
  //     types: [],
  //     jsFn: (left, right) => `${left} <= ${right}`,
  //     sqlFn: (left, right) => `${left} <= ${right}`,
  //   },
  // ],
  // OR: [
  //   {
  //     operandType: []e,
  //     types: [],
  //     jsFn: (left, right) => `${left} <= ${right}`,
  //     sqlFn: (left, right) => `${left} <= ${right}`,
  //   },
  // ],
};
